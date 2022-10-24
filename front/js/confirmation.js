/*
 * DISPLAY CONFIRMATION NUMBER AND REMOVE ALL DATA FROM LOCAL STORAGE
 */

const searchParam = new URLSearchParams(window.location.search);
const orderId = searchParam.get("order");

const displayConfirmation = document.getElementById("orderId");
displayConfirmation.textContent = orderId;

localStorage.removeItem("cart");