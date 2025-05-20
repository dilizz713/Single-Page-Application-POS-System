import {customers_db,item_db,order_db} from "../db/db.js";
import CustomerModel from "../model/ItemModel.js";
import ItemModel from "../model/ItemModel.js";

let currentItemId = 1;


//load items
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


//save
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
        /*let item_data = {
            id: currentItemId,
            name: name,
            price: price,
            qty: qty,
            desc: desc
        };*/
        let item_data = new ItemModel(currentItemId, name, price, qty, desc);
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


//clicked table
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


//update
$('#item-update').on('click', function () {
    const id = parseInt($('#item-id').text());

    const index = item_db.findIndex(i => i.id === id);
    if (index !== -1) {
        item_db[index] = new ItemModel(
            id,
            $('#item-name').val(),
            parseFloat($('#price').val()),
            parseInt($('#qty').val()),
            $('#desc').val()
        );


        loadItems();
        Swal.fire('Updated!', 'Item updated successfully.', 'success');
        resetItemForm();
    }
});

//delete
$('#item-delete').on('click', function () {
    const id = parseInt($('#item-id').text());

    const index = item_db.findIndex(i => i.id === id);
    if (index !== -1) {
        item_db.splice(index, 1);
        loadItems();
        Swal.fire('Deleted!', 'Item deleted.', 'info');
        resetItemForm();
    }

});

//reset
$('#item-reset').on('click', function () {
    resetItemForm();
});
function resetItemForm() {
    $('#item-id').text(currentItemId);
    $('#item-name, #price, #qty, #desc').val('');
}


