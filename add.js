// variables
const cartBtn = document.querySelector(".cart-btn");
const cartItems = document.querySelector(".cart-items");
const productDOM = document.querySelector(".products-center");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartCloseBtn = document.querySelector(".close-cart");
const totalPriceDOM = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const clearBtn = document.querySelector(".clear-btn");

// cart array for holding products
let cart = [];

// buttonsDOM array for holding button of products (button in the image)
let buttonsDOM = [];

// classes
//Storage class for handling local storage
class Storage {
  static savaProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products));
  }

  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("Products"));
    return products.find((product) => product.id === id);
  }

  static savaCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
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

    productDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      const id = button.dataset.id;
      const inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from local storage products
        const cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        // save cart in local storage
        Storage.savaCart(cart);
        // set cart values (cart items and total price)
        this.setCartValues(cart);
        // add cart item
        this.addCartItem(cartItem);

        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let itemsInCart = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      itemsInCart += item.amount;
      totalPrice += item.amount * item.price;
    });
    cartItems.innerText = itemsInCart;
    totalPriceDOM.innerText = totalPrice.toFixed(2);
  }

  addCartItem(item) {
    let result = `<img src=${item.image} alt="product" />
          <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item "  data-id = ${item.id}>remove</span>
          </div>
          <div>
            <i class="fas fa-chevron-up"  data-id = ${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down " data-id = ${item.id}></i>
          </div>
        `;

    const div = document.createElement("div");
    div.setAttribute("class", "cart-item");
    div.setAttribute("data-id", item.id);
    div.innerHTML = result;

    cartContent.appendChild(div);
  }

  removeCartItem(id) {
    // find button and change its content to "add to cart" and its disabled to false to make it allow to click on it.
    let buttonFound = buttonsDOM.find((button) => id === button.dataset.id);
    buttonFound.innerText = "add to cart";
    buttonFound.disabled = false;

    // remove item from local storage.
    cart = cart.filter((itemInCart) => itemInCart.id !== id);
    Storage.savaCart(cart);

    // update how many item in cart and the total price
    this.setCartValues(cart);

    // remove cart from web (DOM tree)
    const itemInDOM = [...cartContent.childNodes].find(
      (child) => child.dataset.id === id
    );
    cartContent.removeChild(itemInDOM);

    // close cart if it's empty
    if (cart.length <= 0) this.hide();
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  clearCart() {
    cart.forEach((item) => {
      this.removeCartItem(item.id);
    });
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    cartCloseBtn.addEventListener("click", this.hide);
    clearBtn.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-chevron-up")) {
        this.increaseAmount(e.target);
      } else if (e.target.classList.contains("fa-chevron-down")) {
        this.decreaseAmount(e.target);
      } else if (e.target.classList.contains("remove-item")) {
        this.removeCartItem(e.target.dataset.id);
      }
    });
  }

  increaseAmount(itemClicked) {
    let itemInCart = cart.find((item) => item.id === itemClicked.dataset.id);
    itemInCart.amount++;

    //change amount in DOM
    itemClicked.nextElementSibling.innerText = itemInCart.amount;

    // change amount in local storage
    Storage.savaCart(cart);

    this.setCartValues(cart);
  }

  decreaseAmount(itemClicked) {
    let itemInCart = cart.find((item) => item.id === itemClicked.dataset.id);
    itemInCart.amount--;

    //change amount in DOM
    itemClicked.previousElementSibling.innerText = itemInCart.amount;

    // change amount in local storage
    Storage.savaCart(cart);

    this.setCartValues(cart);

    if (itemInCart.amount <= 0) this.removeCartItem(itemClicked.dataset.id);
  }

  hide() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
}

// products class for getting  products
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

// start of the code
document.addEventListener("DOMContentLoaded", () => {
  // objects
  const ui = new UI();
  const products = new Products();

  // set up app (like get some info for local storage and display what in it)
  ui.setupAPP();

  products
    .getProducts()
    .then((data) => {
      ui.displayProducts(data);
      Storage.savaProducts(data);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
