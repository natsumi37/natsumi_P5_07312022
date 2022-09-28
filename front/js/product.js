/*
 * DISPLAY EACH PRODUCT ITEM
 */

// Get the id of an item selected

const searchParam = new URLSearchParams(window.location.search)
const itemId = searchParam.get("id")


// Fetch all data of the item by using the id

const url = "http://localhost:3000/api/products/"

async function fetchItem() {
  try {
    const response = await fetch(url + itemId)
    const data = await response.json()
    console.log(data)

    const itemImg = document.querySelector(".item__img")
    const itemName = document.getElementById("title")
    const itemPrice = document.getElementById("price")
    const itemDesc = document.getElementById("description")
    const itemColor = document.getElementById("colors")
    
    itemImg.innerHTML  = `
    <img src="${data.imageUrl}" alt="${data.altTxt}">
    `
    itemName.innerHTML = `
    <h1>${data.name}</h1>
    `
    itemPrice.innerHTML = `
    <span>${data.price}</span>
    `
    itemDesc.innerHTML = `
    <p>${data.description}</p>
    `

    for (let i = 0; i < data.colors.length; i++) {
      itemColor.innerHTML += `
      <option value="${data.colors[i]}">${data.colors[i]}</option>
      `
    }
  } catch(error) {
    console.log(error)
  }
}

fetchItem()


// Store selected data on color and quantity by using LocalStorage

const selectColor = document.getElementById("colors")
const selectQuantity = document.getElementById("quantity")
const addToCart = document.getElementById("addToCart")

let itemCart = [] // item id, quantity, color


addToCart.addEventListener("click", function() {

  if (selectQuantity.value > 0 && selectQuantity.value < 101) {

    if (localStorage.getItem("storeCart") === null) {
      addItemToCart()
      console.log(itemCart)
    } else {
    itemCart = JSON.parse(localStorage.getItem("storeCart"))
    addItemToCart()
    console.log(itemCart)
    }

  } else {
    alert("Please choose the item count between 1-100")
  }

})

function addItemToCart() {

  let selectedItem = {
    _id: itemId,
    quantity: parseInt(selectQuantity.value),
    color: selectColor.value
  }

  itemCart.push(selectedItem)
  localStorage.setItem("storeCart", JSON.stringify(itemCart))
}


// ** if the same item with the same color selected, its quantity should be added



