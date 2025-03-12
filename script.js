const cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const productsList = Array.isArray(data) ? data : [data];
      displayProducts(productsList);
    })
    .catch((err) => {
      alert('Error loadinf products: ', err)
      console.error("Error loading Products: ", err)
    });
});

function displayProducts(products) {
  let cards = document.getElementById("cards");
  cards.innerHTML = "";

  products.forEach((product) => {
    let cardItems = document.createElement("div");
    cardItems.classList.add("card-items");

    let thumbnails = document.createElement("div");
    thumbnails.classList.add("thumbnails");
    cardItems.appendChild(thumbnails);

    let img = document.createElement("img");
    img.classList.add("img");
    img.src = product.image.desktop;
    img.alt = product.name;
    thumbnails.appendChild(img);

    // Quantity control
    let quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");
    quantityControl.style.display = "none";

    let decrementBtn = document.createElement("img");
    decrementBtn.src = "./assets/images/icon-decrement-quantity.svg";
    decrementBtn.alt = "Decrement";
    decrementBtn.classList.add("decrement-btn");

    let quantity = document.createElement("span");
    quantity.classList.add("quantity-value");
    quantity.textContent = "1";

    let incrementBtn = document.createElement("img");
    incrementBtn.src = "./assets/images/icon-increment-quantity.svg";
    incrementBtn.alt = "Increment";
    incrementBtn.classList.add("increment-btn");

    const cartsContainer = document.getElementById("carts-container");
    const emptyCart = document.getElementById("empty-cart");

    decrementBtn.addEventListener("click", () => {
      let currVal = parseInt(quantity.textContent);
      if (currVal > 1) {
        quantity.textContent = currVal - 1;
        updateCart(product, parseInt(quantity.textContent));
      }
    });

    incrementBtn.addEventListener("click", () => {
      let currVal = parseInt(quantity.textContent);
      quantity.textContent = currVal + 1;
      updateCart(product, parseInt(quantity.textContent));
    });

    quantityControl.appendChild(decrementBtn);
    quantityControl.appendChild(quantity);
    quantityControl.appendChild(incrementBtn);
    thumbnails.appendChild(quantityControl);

    // Add to cart
    let addToCart = document.createElement("div");
    addToCart.classList.add("add-to-cart");
    addToCart.innerHTML = `
      <img src="./assets/images/icon-add-to-cart.svg" alt="Cart">
      <p>Add to Cart</p>`;
    thumbnails.appendChild(addToCart);

    // toggle diplay
    addToCart.addEventListener("click", () => {
      addToCart.style.display = "none"; //hide add to cart
      quantityControl.style.display = "flex"; // show quantity control
      updateCart(product, 1);
    });

    // Description
    let desc = document.createElement("div");
    desc.classList.add("desc");
    desc.innerHTML = `
      <p class="product-category">${product.category}</p>
      <h4 class="product-name">${product.name}</h4>
      <h4 class="price">$${product.price.toFixed(2)}</h4>`;
    cardItems.appendChild(desc);

    cards.appendChild(cardItems);
  });
}

// cart update function
function updateCart(product, quantity) {
  const cartCountEl = document.querySelector(".carts-container h2 span");
  const emptyCart = document.getElementById("empty-cart");
  const cartContainer = document.getElementById("carts-container");

  const cartContent =
    document.querySelector(".cart-content") || document.createElement("div");
  cartContent.classList.add("cart-content");
  cartContent.innerHTML = "";

  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity = quantity;
    if (quantity === 0) {
      cart.splice(cart.indexOf(existingItem), 1);
    }
  } else {
    cart.push({ ...product, quantity });
  }

  const updatedCart = cart.filter((item) => item.quantity > 0);

  // calculate total items
  const totalItemCount = updatedCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartCountEl.textContent = `(${totalItemCount})`;

  cartContainer.appendChild(cartContent);

  if (updatedCart.length === 0) {
    emptyCart.style.display = "grid";
    totalConfirm.style.display = "none";
  } else {
    emptyCart.style.display = "none";
    totalConfirm.style.display = "block";
  }

  updatedCart.forEach((item) => {
    let addedCart = document.createElement("div");
    addedCart.classList.add("cart-item");
    // addedCart.setAttribute("data-id", item.name);

    addedCart.innerHTML = `
      <div class="cart-item-div">
      <div class="products-name-price">
        <p>${item.name}</p>
        <div class="products-price">
          <p class="product-quantity">${item.quantity}x</p>
          <p>@ $${item.price}</p>
          <p class="total-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      <img src="./assets/images/icon-remove-item.svg" class="remove-item" alt="Remove">
            </div>
      <div class="end-line"></div>
        `;
    addedCart
      .querySelector(".remove-item")
      .addEventListener("click", () => removeFromCart(item));

    cartContent.appendChild(addedCart);
  });
  cartContainer.appendChild(totalConfirm);
  calculateTotalPrice();
}

// to remove item from cart
function removeFromCart(product) {
  const index = cart.findIndex((item) => item.name === product.name);

  if (index > -1) {
    cart.splice(index, 1);
  }

  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCountEl = document.querySelector(".carts-container h2 span");
  const emptyCart = document.getElementById("empty-cart");

  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountEl.textContent = `(${totalItemCount})`;

  const cartContent = document.querySelector(".cart-content");
  cartContent.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.style.display = "grid";
    totalConfirm.style.display = "none";
  } else {
    emptyCart.style.display = "none";
    totalConfirm.style.display = "block";
  }

  cart.forEach((item) => {
    let addedCart = document.createElement("div");
    addedCart.classList.add("cart-item");
    addedCart.setAttribute("data-id", item.name);

    addedCart.innerHTML = `
      <div class="cart-item-div">
      <div class="products-name-price">
        <p>${item.name}</p>
        <div class="products-price">
          <p class="product-quantity">${item.quantity}x</p>
          <p>@ $${item.price}</p>
          <p class="total-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
      <img src="./assets/images/icon-remove-item.svg" class="remove-item" alt="Remove">
      </div>
      <div class="end-line"></div>
    `;

    addedCart
      .querySelector(".remove-item")
      .addEventListener("click", () => removeFromCart(item));

    cartContent.appendChild(addedCart);
  });
}

let totalConfirm = document.createElement("div");
totalConfirm.classList.add("total-confirm");

function calculateTotalPrice() {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalConfirm.innerHTML = `
    <div class="total-orders">
      <p>Order Total</p>
      <h3>$${totalPrice.toFixed(2)}</h3>
    </div>
    <div class="carbon-neutral">
      <img src="./assets/images/icon-carbon-neutral.svg">
      <p>This is a carbon-neutral delivery</p>
    </div>
    <button>Confirm Order</button>
      `;

  const cartsContainer = document.getElementById("carts-container");
  if (!document.querySelector(".total-confirm")) {
    cartsContainer.appendChild(totalConfirm);
  }
  totalConfirm.querySelector("button").addEventListener("click", showPopup);
}

// Popup elements
function showPopup() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  const popupOverlay = document.getElementById("popup-overlay");
  const popupItems = document.getElementById("popup-items");
  const popupTotalPrice = document.getElementById("popup-total-price");

  popupItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const popupItem = document.createElement("div");
    popupItem.classList.add("popup-item");

    popupItem.innerHTML = `
    <div class=popup-item-in>
      <img src="${item.image.mobile}" alt="${item.name}">
      <div class="item-details">
        <div class="item-details-in">
          <p class="item-name">${item.name}</p>
          <div class="price-and-qty">
            <p class="qty">${item.quantity}x</p>
            <p class="price">@ $${item.price.toFixed(2)}</p>
          </div>
        </div>
        <p class="total-price">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
    <div class="end-line"><div>
  `;

    popupItems.appendChild(popupItem);
    totalPrice += item.price * item.quantity;
  });

  popupTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  popupOverlay.style.display = "flex";
}

const closePopup = document.getElementById("close-popup");
const startNewOrder = document.getElementById("start-new-order");
const popupOverlay = document.getElementById("popup-overlay");

// Start new order btn
startNewOrder.addEventListener("click", () => {
  cart.length = 0;
  updateCartDisplay();
  popupOverlay.style.display = "none";
});

// cancel btn
closePopup.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});
