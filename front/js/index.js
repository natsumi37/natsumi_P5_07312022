/*
 * INSERTIG ALL THE PRODUCT INFORMATION FROM THE API INTO THE WEBSITE
 */


const url = "http://localhost:3000/api/products/"

// Fetch data of all products

async function fetchItems() {
  try {
    const response = await fetch(url)
    const data = await response.json()

    for (let i = 0; i < data.length; i++) {

      const items = document.getElementById("items")

      items.innerHTML += `
        <a href="./product.html?id=${data[i]._id}">
          <article>
            <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
            <h3>${data[i].name}</h3>
            <p>${data[i].description}</p>
          </article>
        </a>
      `
    }
  } catch(error) {
    console.log(error)
  }
}

fetchItems()

