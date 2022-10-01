/*
 * DISPLAY ALL THE ITEMS IN THE CART AND CAN BE ADJUSTED
 * IN QUANTITY AND DELETE
 */

// Get data of all the selected items from local storage

const itemCart = JSON.parse(localStorage.getItem("storeCart"))
console.log(itemCart)

// Fetch the items

const url = "http://localhost:3000/api/products/"

async function fetchItems() {
  try {    
    for (let i = 0; i < itemCart.length; i++) {
      const response = await fetch(url + itemCart[i]._id)
      const data = await response.json()
      console.log(data)

      const itemsInCart = document.getElementById("cart__items")
      itemsInCart.innerHTML = `
        <article class="cart__item" data-id="${data._id}" data-color="${data.colors}">
          <div class="cart__item__img">
            <img src="${data.imageUrl}" alt="${data.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${data.name}</h2>
              <p>${data.colors}</p>
              <p>${data.price}</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Delete</p>
              </div>
            </div>
          </div>
        </article>
  
      `
    }
  } catch(error) {
    console.log(error)
  }
}

fetchItems()

// items should be displayed by grouped in model and color