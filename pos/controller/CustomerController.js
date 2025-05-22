import {customers_db,item_db,order_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";


let currentCustomerId = 1;

//load customers
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

//save
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

        let customer_data = new CustomerModel(currentCustomerId , name, address, nic, mobile, email);
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

//clicked table
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

//update
$('#customer-update').on('click', function () {
    const id = parseInt($('#customerId').text());

    const index = customers_db.findIndex(c => c.id === id);
    if (index !== -1) {
        customers_db[index] = new CustomerModel(
           id,
            $('#name').val(),
            $('#address').val(),
            $('#nic').val(),
            $('#mobile').val(),
            $('#email').val()
        );
        loadCustomers();
        Swal.fire('Updated!', 'Customer details updated.', 'success');
        resetCustomerForm();
    }
});

//delete
$('#customer-delete').on('click', function () {
    const id = parseInt($('#customerId').text());

   const index = customers_db.findIndex(c => c.id === id);

   if (index !== -1) {
       customers_db.splice(index, 1);
       loadCustomers();
       Swal.fire('Deleted!', 'Customer deleted.', 'info');
       resetCustomerForm();
   }

});

//reset
$('#customer-reset').on('click', function () {
    resetCustomerForm();
});

function resetCustomerForm() {
    $('#customerId').text(currentCustomerId);
    $('#name, #address, #nic, #mobile, #email').val('');
}


