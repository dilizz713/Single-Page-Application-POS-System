const today = new Date();
const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
});
document.getElementById('todayDate').innerText = formattedDate;

$("#customer-content").css("display", "none");
$("#item-content").css("display", "none");
$("#order-content").css("display", "none");
$("#order-history-content").css("display", "none");
$("#invoice-content").css("display", "none");

$("#nav-home").on('click', function () {
    $("#dashboard-content").css("display", "block");
    $("#customer-content").css("display", "none");
    $("#item-content").css("display", "none");
    $("#order-content").css("display", "none");
    $("#order-history-content").css("display", "none");
    $("#invoice-content").css("display", "none");
})
$("#nav-customer").on('click', function () {
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#order-content").css("display", "none");
    $("#order-history-content").css("display", "none");
    $("#invoice-content").css("display", "none");
})
$("#nav-item").on('click', function () {
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#item-content").css("display", "block");
    $("#order-content").css("display", "none");
    $("#order-history-content").css("display", "none");
    $("#invoice-content").css("display", "none");
})
$("#nav-order").on('click', function () {
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#item-content").css("display", "none");
    $("#order-content").css("display", "block");
    $("#order-history-content").css("display", "none");
    $("#invoice-content").css("display", "none");
})
$("#order-history-btn").on('click', function () {
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#item-content").css("display", "none");
    $("#order-content").css("display", "none");
    $("#order-history-content").css("display", "block");
    $("#invoice-content").css("display", "none");
})
$("#invoice-btn").on('click', function () {
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#item-content").css("display", "none");
    $("#order-content").css("display", "none");
    $("#order-history-content").css("display", "none");
    $("#invoice-content").css("display", "block");
})

/*--------------------------------CUSTOMER---------------------------------------*/

let customers_db = [];
let currentCustomerId = 1;

function loadCustomers() {
    $('#customer-tbody').empty();

    customers_db.map((item , index) => {
        let name = item.name;
        let address = item.address;
        let nic = item.nic;
        let number = item.mobile;
        let email = item.email;

        let data = `<tr>
        <td>${item.id}</td>
        <td>${name}</td>
        <td>${address}</td>
        <td>${nic}</td>
        <td>${number}</td>
        <td>${email}</td>
        </tr>`
        $('#customer-tbody').append(data);
    })
}

$('#customer-save').on('click', function () {
    let name = $('#name').val();
    let address = $('#address').val();
    let nic = $('#nic').val();
    let mobile = $('#mobile').val();
    let email = $('#email').val();

    if (name === '' || address === '' || nic === '' || mobile === '' || email === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid inputs',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }else{

        let customer_data = {
            id: currentCustomerId,
            name: name,
            address: address,
            nic: nic,
            mobile: mobile,
            email: email,

        };

        customers_db.push(customer_data);

        console.log(customers_db);
        loadCustomers();

        currentCustomerId++;
        $('#customerId').text(currentCustomerId);

        $('#name, #address, #nic, #mobile, #email').val('');

        Swal.fire({
            title: 'Added successfully!',
            icon: 'success',
            draggable: true
        });
    }
});

$("#customer-tbody").on('click' , 'tr', function () {
    const selectedId = $(this).find('td:first').text();
    const selectedCustomer = customers_db.find(c => c.id.toString() === selectedId);

    if (selectedCustomer) {
        $('#customerId').text(selectedCustomer.id);
        $('#name').val(selectedCustomer.name);
        $('#address').val(selectedCustomer.address);
        $('#nic').val(selectedCustomer.nic);
        $('#mobile').val(selectedCustomer.mobile);
        $('#email').val(selectedCustomer.email);
    }
});

$('#customer-update').on('click', function () {
    const id = parseInt($('#customerId').text());

    const index = customers_db.findIndex(c => c.id === id);
    if (index !== -1) {
        customers_db[index] = {
            id: id,
            name: $('#name').val(),
            address: $('#address').val(),
            nic: $('#nic').val(),
            mobile: $('#mobile').val(),
            email: $('#email').val()
        };
        loadCustomers();
        Swal.fire('Updated!', 'Customer details updated.', 'success');
        resetCustomerForm();
    }
});

$('#customer-delete').on('click', function () {
    const id = parseInt($('#customerId').text());

    customers_db = customers_db.filter(c => c.id !== id);
    loadCustomers();
    Swal.fire('Deleted!', 'Customer deleted.', 'info');
    resetCustomerForm();
});

function resetCustomerForm() {
    $('#customerId').text(currentCustomerId);
    $('#name, #address, #nic, #mobile, #email').val('');
}

$('#customer-reset').on('click', function () {
    resetCustomerForm();
});

/*--------------------------------ITEM---------------------------------------*/

let item_db = [];
let currentItemId = 1;

function loadItems() {
    $('#item-tbody').empty();

    item_db.map((item , index) => {
        let itemName = item.name;
        let price = item.price;
        let qty = item.qty;
        let desc = item.desc;

        let data = `<tr>
        <td>${item.id}</td>
        <td>${itemName}</td>
        <td>${price}</td>
        <td>${qty}</td>
        <td>${desc}</td>
        </tr>`
        $('#item-tbody').append(data);
    })
}

$('#item-save').on('click', function () {
    let name = $('#item-name').val();
    let price = $('#price').val();
    let qty = $('#qty').val();
    let desc = $('#desc').val();

    if (name === '' || price === '' || qty === '' || desc === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid inputs',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }else{
        let item_data = {
            id: currentItemId,
            name: name,
            price: price,
            qty: qty,
            desc: desc
        };

        item_db.push(item_data);

        console.log(item_db);
        loadItems();

        currentItemId++;
        $('#item-id').text(currentItemId);

        $('#item-name, #price, #qty, #desc').val('');

        Swal.fire({
            title: 'Added successfully!',
            icon: 'success',
            draggable: true
        });
    }
});

$('#item-tbody').on('click', 'tr', function () {
    const selectedId = $(this).find('td:first').text();
    const selectedItem = item_db.find(i => i.id.toString() === selectedId);

    if (selectedItem) {
        $('#item-id').text(selectedItem.id);
        $('#item-name').val(selectedItem.name);
        $('#price').val(selectedItem.price);
        $('#qty').val(selectedItem.qty);
        $('#desc').val(selectedItem.desc);
    }
});

$('#item-update').on('click', function () {
    const id = parseInt($('#item-id').text());

    const index = item_db.findIndex(i => i.id === id);
    if (index !== -1) {
        item_db[index] = {
            id: id,
            name: $('#item-name').val(),
            price: parseFloat($('#price').val()),
            qty: parseInt($('#qty').val()),
            desc: $('#desc').val()
        };
        loadItems();
        Swal.fire('Updated!', 'Item updated successfully.', 'success');
        resetItemForm();
    }
});

$('#item-delete').on('click', function () {
    const id = parseInt($('#item-id').text());

    item_db = item_db.filter(i => i.id !== id);
    loadItems();
    Swal.fire('Deleted!', 'Item deleted.', 'info');
    resetItemForm();
});

function resetItemForm() {
    $('#item-id').text(currentItemId);
    $('#item-name, #price, #qty, #desc').val('');
}

$('#item-reset').on('click', function () {
    resetItemForm();
});


/*--------------------------------PLACE-ORDER---------------------------------------*/
let order_db = [];
let currentOrderId = 1;
let tempOrderItems = [];

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
    loadItems();

    $("#quantity").val('');
    $("#description").val('');
    $("#total-amount").text("Amount");
    selectedItemId = null;
    selectedItemPrice = 0;
    $("#order-content select").last().val('Select Item');

})

function loadTempOrderTable() {
    $("#order-tbody").empty();

    tempOrderItems.forEach(item => {
        let row = `
        <tr>
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

    $("#order-content select").last().val(item.itemId);
    $("#quantity").val(item.qty);
    $("#description").val('');
    $("#total-amount").text(parseFloat(item.total).toFixed(2));

    selectedItemId = item.itemId;
    selectedItemPrice = parseFloat(item.unitPrice);
});

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

    let customerId = selectedCustomerId;

    if (!customerId) {
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
        customerId: customerId,
        date: formattedDate,
        items: [...tempOrderItems]
    };

    order_db.push(order);

    Swal.fire({
        title: "Order Placed!",
        text: `Order #${currentOrderId} saved successfully.`,
        icon: "success",
        confirmButtonText: "OK"
    });


    tempOrderItems = [];
    loadTempOrderTable();
    $("#quantity").val('');
    $("#description").val('');
    $("#total-amount").text("Amount");
    $("#order-content select").first().val('Select Customer');
    $("#order-content select").last().val('Select Item');

    selectedCustomerId = null;
    selectedItemId = null;
    selectedItemPrice = 0;

    currentOrderId++;
    $("#order-id").text(currentOrderId);
});


/*--------------------------------logout-------------------------------*/

$('#logout-btn').on('click', function () {
    if (confirm('Are you sure you want to logout?')){
        window.location.href = 'index.html';
    }
})