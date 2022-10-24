/*
 * DISPLAY ALL THE ITEMS IN THE CART AND CAN BE ADJUSTED
 * IN QUANTITY AND DELETE
 */

// Get data of all the selected items from local storage & sort the items by id

const itemsInLocalStorage = JSON.parse(localStorage.getItem("cart"));
itemsInLocalStorage.sort(function(a, b) {
  if (a._id < b._id) return -1;
  if (a._id > b._id) return 1;
  return 0;
});
console.log(itemsInLocalStorage);


// Store data in a variable named cartItems

const url = "http://localhost:3000/api/products/";

let cartItems = [];

async function fetchItems(array) {
  try {
    for (let i = 0; i < array.length; i++) {
      const response = await fetch(url + array[i]._id);
      const data = await response.json();
      cartItems.push(data);
      }
      displayCartItems(cartItems, itemsInLocalStorage);
      itemsTotal(cartItems, itemsInLocalStorage);
      console.log(cartItems);
  } catch (error) {
    console.log(error);
  }
}

fetchItems(itemsInLocalStorage);



// Display all the items in cartItems by setting two arguments,
// "arrayApi" for data of item details, "arrayLocalStorage" for data of quantity and color selected

function displayCartItems(arrayApi, arrayLocalStorage) {
  const displayCartItems = document.getElementById("cart__items");
  
  for (let i = 0; i < arrayApi.length; i++) {
    displayCartItems.innerHTML += `
      <article class="cart__item" data-id="${arrayApi[i]._id}" data-color="${arrayLocalStorage[i].color}">
        <div class="cart__item__img">
          <img src="${arrayApi[i].imageUrl}" alt="${arrayApi[i].altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${arrayApi[i].name}</h2>
            <p>${arrayLocalStorage[i].color}</p>
            <p>€ ${arrayApi[i].price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté: </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" cartIndex="${i}" value="${arrayLocalStorage[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem" cartIndex="${i}">Delete</p>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  bindQuantityChange();
  bindDeleteItem();
}


// Caliculate total quantity and total price

let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");

function itemsTotal(arrayApi, arrayLocalStorage) {
  let sumQuantity = 0;
  let sumPrice = 0;
  
  if (arrayApi) {
    for (let i = 0; i < arrayLocalStorage.length; i++) {
      sumQuantity += parseInt(arrayLocalStorage[i].quantity);
      totalQuantity.textContent = sumQuantity;
    }

    for (let i = 0; i < arrayApi.length; i++) {
      sumPrice += arrayApi[i].price * parseInt(arrayLocalStorage[i].quantity);
      totalPrice.textContent = sumPrice;
    }
  }
}


// Adjusting cart items by listening for a change of quantity and a click for delete

function bindQuantityChange() {
  const itemQuantity = document.querySelectorAll(".itemQuantity");
  
  itemQuantity.forEach(item => {
    item.addEventListener("change", event => {
      const cartIndex = event.target.getAttribute("cartIndex");

      itemsInLocalStorage[cartIndex].quantity = parseInt(event.target.value);
      localStorage.setItem("cart", JSON.stringify(itemsInLocalStorage));

      itemsTotal(cartItems, itemsInLocalStorage);
    })
  })
}

function bindDeleteItem() {
  const deleteItem = document.querySelectorAll(".deleteItem");

  deleteItem.forEach(item => {
    item.addEventListener("click", event => {
      const cartIndex = event.target.getAttribute("cartIndex");
      const undisplayItem = event.target.closest("article");

      itemsInLocalStorage.splice(cartIndex, 1);
      localStorage.setItem("cart", JSON.stringify(itemsInLocalStorage))
      cartItems.splice(cartIndex, 1);
      console.log(cartItems);

      itemsTotal(cartItems, itemsInLocalStorage);
      undisplayItem.remove();
    })
  })
}


// Check if users' input is valid

const userFirstName = document.getElementById("firstName");
const userFirstNameErrorMessage = document.getElementById("firstNameErrorMsg");
const userLastName = document.getElementById("lastName");
const userLastNameErrorMessage = document.getElementById("lastNameErrorMsg");
const userAddress = document.getElementById("address");
const userAddressErrorMessage = document.getElementById("addressErrorMsg");
const userCity = document.getElementById("city");
const userCityErrorMessage = document.getElementById("cityErrorMsg");
const userEmail = document.getElementById("email");
const userEmailErrorMessage = document.getElementById("emailErrorMsg");

function invalidUserInput() {
  let error = false;

  if (!userFirstName.value.match(/^[A-Za-z]*$/)) {
    userFirstNameErrorMessage.innerHTML = `
      <p>Please double check your first name</p>
    `;
    error = true;
  } else {
    userFirstNameErrorMessage.textContent = "";
  }

  if (!userLastName.value.match(/^[A-Za-z]*$/)) {
    userLastNameErrorMessage.innerHTML = `
      <p>Please double check your last name</p>
    `;
    error = true;
  } else {
    userLastNameErrorMessage.textContent = "";
  }
  
  if (!userAddress.value) {
    userAddressErrorMessage.innerHTML = `
      <p>Please double check your address</p>
    `;
    error = true;
  } else {
    userAddressErrorMessage.textContent = "";
  }
  
  if (!userCity.value) {
    userCityErrorMessage.innerHTML = `
      <p>Please double check your city</p>
    `;
    error = true;
  } else {
    userCityErrorMessage.textContent = "";
  }

  if (!userEmail.value.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/)) {
    userEmailErrorMessage.innerHTML = `
      <p>Please double check your email address</p>
    `;
    error = true;
  } else {
    userEmailErrorMessage.textContent = "";
  }
  
  return error;
}


// Render order confirmation button

const confirmOrderButton = document.getElementById("order");
let orderId = "";

async function post(item) {
  try {
    const response = await fetch(url + "order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item),
    })
    const data = await response.json();
    orderId = await data.orderId;
  } catch(error) {
    console.log(error);
  }
  window.location.href = "confirmation.html?order=" + orderId;
}

confirmOrderButton.addEventListener("click", (event) => {
  event.preventDefault();
  const itemIds = cartItems.map(item => { return item._id });
  
  if (invalidUserInput() === false) {
    const userContact = {
      firstName: userFirstName.value,
      lastName: userLastName.value,
      address: userAddress.value,
      city: userCity.value,
      email: userEmail.value
    }
    post({ contact: userContact, products: itemIds });
  } else {
    console.log("input error");
  }
})