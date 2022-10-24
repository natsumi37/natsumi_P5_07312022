/*
 * DISPLAY EACH PRODUCT ITEM
 */

// Get the id of an item selected

const searchParam = new URLSearchParams(window.location.search);
const itemId = searchParam.get("id");


// Fetch data of the item by using the id

const url = "http://localhost:3000/api/products/";

async function fetchItem() {
  try {
    const response = await fetch(url + itemId);
    const data = await response.json();
    console.log(data);

    const itemImg = document.querySelector(".item__img");
    const itemName = document.getElementById("title");
    const itemPrice = document.getElementById("price");
    const itemDesc = document.getElementById("description");
    const itemColor = document.getElementById("colors");
    
    itemImg.innerHTML  = `
    <img src="${data.imageUrl}" alt="${data.altTxt}">
    `;
    itemName.innerHTML = `
    <h1>${data.name}</h1>
    `;
    itemPrice.innerHTML = `
    <span>${data.price}</span>
    `;
    itemDesc.innerHTML = `
    <p>${data.description}</p>
    `;

    for (let i = 0; i < data.colors.length; i++) {
      itemColor.innerHTML += `
      <option value="${data.colors[i]}">${data.colors[i]}</option>
      `;
    }
  } catch(error) {
    console.log(error);
  }
}

fetchItem();


// Add items to a cart and local storage

const selectColor = document.getElementById("colors");
const selectQuantity = document.getElementById("quantity");
const addToCartButton = document.getElementById("addToCart");

let cartItems = [];

addToCartButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (selectQuantity.value > 0 && selectQuantity.value < 101) {

    if (localStorage.getItem("cart") === null) {

      const selectedItem = {
        _id: itemId,
        quantity: parseInt(selectQuantity.value),
        color: selectColor.value
      };
      cartItems.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log(cartItems);

    } else {
      cartItems = JSON.parse(localStorage.getItem("cart"));
      
      const selectedItem = {
        _id: itemId,
        quantity: parseInt(selectQuantity.value),
        color: selectColor.value
      };
      let duplicateItems = false;

      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i]._id === selectedItem._id && cartItems[i].color === selectedItem.color) {
          cartItems[i].quantity += selectedItem.quantity;
          duplicateItems = true;
          break;
        } 
      }
      if (!duplicateItems) {
        cartItems.push(selectedItem);
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      console.log(cartItems);
    }
  } else {
    alert("Please choose the item count between 1-100");
  }

})