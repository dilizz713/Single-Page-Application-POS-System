import { customers_db, item_db, order_db } from "../db/db.js";

function updateDashboardStats() {
    $("#total-customers").text(customers_db.length);
    $("#total-items").text(item_db.length);

    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-05-20"
    const todayOrders = order_db.filter(order => order.date === today);
    $("#today-orders").text(todayOrders.length);


    $("#todayDate").text(formatDate(new Date()));
}

function formatDate(dateObj) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
}

$(document).ready(() => {
    updateDashboardStats();
});
