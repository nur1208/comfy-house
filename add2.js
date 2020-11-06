// select element from html
const $cartBtn = $(".cart-btn");
const $cartItems = $(".cart-items");
const $productDOM = $(".products-center");
const $cartOverlay = $(".cart-overlay");
const $cartDOM = $(".cart");
const $cartCloseBtn = $(".close-cart");
const $totalPriceDOM = $(".cart-total");
const $cartContent = $(".cart-content");
const $clearBtn = $(".clear-btn");

// cart array for holding products
let cart = [];

// buttonsDOM array for holding button of products (button in the image)
let buttonsDOM = [];

//classes

//Storage class for handling local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

// user interface class of you know UI stuff
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((element) => {
      result += `<article class="product">
            <div class="img-container">
                <img
                    src=${element.image}
                alt="product"
                class="product-img"
                />
                <button class="bag-btn" data-id=${element.id}>
                <i class="fas fa-shopping-cart"></i>
                add to cart
                </button>
            </div>
            <h3>${element.title}</h4>
            <h4>$${element.price}</h4>
            </article> `;
    });

    $productDOM.html(() => result);
  }

  getBagButtons() {
    const buttons = [...$(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      const id = button.dataset.id;
      const inCart = cart.find((item) => {
        item.id === id;
      });
      if (inCart) {
        $(button).text("In Cart");
        button.disabled = true;
      }
    });
  }
}

// products class for products
class Products {
  async getProducts() {
    try {
      const result = await fetch("products.json");
      const data = await result.json();
      let products = data.items;

      products = products.map((product) => {
        const { title, price } = product.fields;
        const id = product.sys.id;
        const image = product.fields.image.fields.file.url;
        return { title, price, id, image };
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
$(() => {
  // objects
  const ui = new UI();
  const products = new Products();

  // set up app (like get some info for local storage and display what in it)
  //   ui.setupAPP();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
