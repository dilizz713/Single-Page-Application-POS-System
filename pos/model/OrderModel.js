export default class OrderModel {
    constructor(date , order_id , customer_id , customer_name , total) {
        this.date = date;
        this.order_id = order_id;
        this.customer_id = customer_id;
        this.customer_name = customer_name;
        this.total = total;
    }
}