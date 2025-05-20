import {customers_db,item_db,order_db} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

let currentOrderId = 1;
let tempOrderItems = [];

let selectedCustomerId = null;
let selectedItemId = null;
let selectedItemPrice = 0;

const date = new Date();
const formatDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});
document.getElementById('order-date').innerText = formatDate;

$("#order-content select").last().on('change', function () {
    selectedItemId = $(this).val();

    let selectedItem = item_db.find(i => i.id.toString() === selectedItemId);
    if (selectedItem){
        selectedItemPrice = parseFloat(selectedItem.price);
        calculateTotalAmount();
    }
});

$('#quantity').on('input',function (){
    calculateTotalAmount();
});

function calculateTotalAmount(){
    let quantity = parseInt($("#quantity").val());
    if (!isNaN(quantity) && selectedItemPrice > 0) {
        let total = quantity * selectedItemPrice;
        $("#total-amount").text(total.toFixed(2));
    } else {
        $("#total-amount").text("Amount");
    }
}

function loadOrders() {
    $('#order-tbody').empty();

}

function selectCustomer() {
    const customerSelect = $("#order-content select").first();
    customerSelect.empty().append('<option selected disabled>Select Customer</option>');

    customers_db.forEach(c => {
        customerSelect.append(`<option value="${c.id}">${c.name}</option>`);
    });

}
function selectItem(){
    const itemSelect = $("#order-content select").last();
    itemSelect.empty().append('<option selected disabled>Select Item</option>');

    item_db.forEach(i => {
        itemSelect.append(`<option value="${i.id}">${i.name}</option>`);
    });
}

$("#nav-order").on('click' , function (){
    selectCustomer();
    selectItem();
});

$('#add-order').on('click' , function (){

    let itemId = selectedItemId;
    let quantity = parseInt($("#quantity").val());
    let description = $("#description").val();

    if (!itemId || isNaN(quantity) || quantity <= 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item and enter a valid quantity.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let selectedItemIndex = item_db.findIndex(i => i.id.toString() === itemId);
    if (selectedItemIndex === -1) return;

    let selectedItem = item_db[selectedItemIndex];

    if (quantity > selectedItem.qty) {
        Swal.fire({
            title: 'Error!',
            text: `Only ${selectedItem.qty} units in stock.`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    item_db[selectedItemIndex].qty -= quantity;

    let total = quantity * selectedItem.price;

    let orderItem = {
        orderId: currentOrderId,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        qty: quantity,
        unitPrice: selectedItem.price,
        total: total
    };

    tempOrderItems.push(orderItem);

    loadTempOrderTable();

    $("#quantity").val('');
    $("#description").val('');
    $("#total-amount").text("Amount");
    selectedItemId = null;
    selectedItemPrice = 0;
    $("#order-content select").last().val('Select Item');

})

function loadTempOrderTable() {
    $("#order-tbody").empty();
    tempOrderItems.forEach((item, index) => {
        let row = `
        <tr data-index="${index}">
            <td>${item.orderId}</td>
            <td>${item.itemName}</td>
            <td>${item.qty}</td>
            <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
            <td>${parseFloat(item.total).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm delete-order">Delete</button></td>
        </tr>`;
        $("#order-tbody").append(row);
    });
}

let editIndex = null;

$(document).on("click", "#order-tbody tr", function () {
    editIndex = $(this).data('index');
    const item = tempOrderItems[editIndex];

    if (!item) return;

    $("#order-content select").last().val(item.itemId);
    $("#quantity").val(item.qty);
    $("#description").val('');
    $("#total-amount").text(parseFloat(item.total).toFixed(2));

    selectedItemId = item.itemId;
    selectedItemPrice = parseFloat(item.unitPrice);

});

/*$('#update-order').on('click', function () {
    if (editIndex === null) return;

    let quantity = parseInt($("#quantity").val());
    let itemId = selectedItemId;

    if (!itemId || isNaN(quantity) || quantity <= 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Please select an item and enter a valid quantity.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let itemIndex = item_db.findIndex(i => i.id.toString() === itemId);
    if (itemIndex === -1) return;

    const itemData = item_db[itemIndex];
    const previous = tempOrderItems[editIndex];


    itemData.qty += previous.qty;

    if (quantity > itemData.qty) {
        Swal.fire({
            title: 'Error!',
            text: `Only ${itemData.qty} units in stock.`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        itemData.qty -= previous.qty;
        return;
    }

    itemData.qty -= quantity;

    tempOrderItems[editIndex] = {
        orderId: currentOrderId,
        itemId: itemData.id,
        itemName: itemData.name,
        qty: quantity,
        unitPrice: itemData.price,
        total: quantity * itemData.price
    };

    loadTempOrderTable();
    selectItem();  // reload dropdown

    $("#quantity").val('');
    $("#description").val('');
    $("#total-amount").text("Amount");
    selectedItemId = null;
    selectedItemPrice = 0;
    editIndex = null;

});*/

$(document).on("click", ".delete-order", function (e) {
    e.stopPropagation();
    const index = $(this).closest('tr').data('index');
    tempOrderItems.splice(index, 1);
    loadTempOrderTable();
});

$("#reset-order-form").on("click", function () {
    $("#order-content select").val('Select');
    $("#quantity, #description").val('');
    $("#total-amount").text("Amount");
    selectedItemId = null;
    selectedItemPrice = 0;
    editIndex = null;
});

$("#place-order").on("click", function () {
    if (tempOrderItems.length === 0) {
        Swal.fire({
            title: "No Items!",
            text: "Add items before placing an order.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    selectedCustomerId = $("#order-content select").first().val(); // Get selected customer

    if (!selectedCustomerId) {
        Swal.fire({
            title: "No Customer Selected!",
            text: "Please select a customer before placing the order.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    let order = {
        orderId: currentOrderId,
        customerId: selectedCustomerId,
        date: formatDate,
        items: [...tempOrderItems]
    };

    order_db.push(order);

    Swal.fire({
        title: "Order Placed!",
        text: `Order #${currentOrderId} saved successfully.`,
        icon: "success",
        confirmButtonText: "OK"
    });

    console.log(order_db);

    tempOrderItems = [];
    loadTempOrderTable();
    selectItem();

    $("#order-content select").first().val('Select Customer');
    $("#order-content select").last().val('Select Item');
    $("#quantity, #description").val('');
    $("#total-amount").text("Amount");

    selectedCustomerId = null;
    selectedItemId = null;
    selectedItemPrice = 0;
    currentOrderId++;

    $("#order-id").text(currentOrderId);
    $("#add-order").show();
    $("#update-order").hide();
});









