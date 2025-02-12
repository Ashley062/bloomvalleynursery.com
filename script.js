// ********** HEADER NAV BUTTONS

const navEl = document.querySelector(".nav");
const hamburgerE1 = document.querySelector(".hamburger");

hamburgerE1.addEventListener("click", () => {
  navEl.classList.toggle("nav--open");
  hamburgerE1.classList.toggle("hamburger--open");
});

navEl.addEventListener("click", () => {
  navEl.classList.remove("nav--open");
  hamburgerE1.classList.remove("hamburger--open");
});

// ********** ABOUT PAGE (Customer Feedback Form with localStorage)

function submitForm() {
    const name = document.getElementById("feedback-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const subject = document.getElementById("feedback-subject").value.trim();
    const feedback = document.getElementById("feedback-message").value.trim();

    if (!name || !email || !subject || !feedback) {
        window.alert("Please provide your information to submit.");
        return;
    }

    const customerInfo = { name, email, subject, feedback };
    localStorage.setItem(name, JSON.stringify(customerInfo));

    const savedInfo = JSON.parse(localStorage.getItem(name));
    window.alert("Thank you for your message, " + savedInfo.name + "!");
}

// ********** FOOTER SUBSCRIBE BUTTON

function subscribeButton() {
    const emailInput = document.getElementById("email").value.trim();

    if (emailInput === "") {
        window.alert("Please put your email here to subscribe.");
    } else {
        window.alert("Thank you for subscribing!");
    }
}

// ********** SHOP GALLERY PAGE

function setupCartToggle() {
    const cartIcon = document.querySelector("#nav-cart");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");

    if (cartIcon && cart && cartClose) {
        cartIcon.addEventListener("click", () => cart.classList.toggle("active"));
        cartClose.addEventListener("click", () => cart.classList.toggle("active"));
    }
}

setupCartToggle();

if (window.location.pathname.includes('shopGallery.html')) {
    function addItemsToCart() {
        const addCartButtons = document.querySelectorAll('.btn-addToCart');
        const cartContent = document.querySelector(".cart-content");

        function saveCartToSession() {
            const cartItems = [];
            cartContent.querySelectorAll(".cart-box").forEach(cartBox => {
                cartItems.push({
                    img: cartBox.querySelector(".cart-img").src,
                    title: cartBox.querySelector(".cart-product-title").textContent,
                    price: cartBox.querySelector(".cart-price").textContent,
                    quantity: cartBox.querySelector(".number").textContent
                });
            });
            sessionStorage.setItem("cart", JSON.stringify(cartItems));
        }

        function loadCartFromSession() {
            const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
            savedCart.forEach(item => addToCart(item));
        }

        addCartButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const productBox = event.target.closest('.product-box');
                addToCart({
                    img: productBox.querySelector("img").src,
                    title: productBox.querySelector(".product-title").textContent,
                    price: productBox.querySelector(".price").textContent,
                    quantity: "1"
                });
                alert("Item is added to the cart.");
                saveCartToSession();
            });
        });

        function addToCart(item) {
            const cartItems = cartContent.querySelectorAll(".cart-product-title");
            for (let cartItem of cartItems) {
                if (cartItem.textContent === item.title) {
                    alert("This item is already in the cart.");
                    return;
                }
            }

            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");
            cartBox.innerHTML = `
                <img src="${item.img}" class="cart-img" />
                <div class="cart-detail">
                    <h2 class="cart-product-title">${item.title}</h2>
                    <span class="cart-price">${item.price}</span>
                    <div class="cart-quantity">
                        <button id="decrement">-</button>
                        <span class="number">${item.quantity}</span>
                        <button id="increment">+</button>
                    </div>
                </div>
                <i class="fa-solid fa-trash cart-remove"></i>
            `;

            cartContent.appendChild(cartBox);

            cartBox.querySelector(".cart-remove").addEventListener("click", () => {
                cartBox.remove();
                updateCartCount(-1);
                updateTotalPrice();
                saveCartToSession();
            });

            cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
                const numberElement = cartBox.querySelector(".number");
                let quantity = parseInt(numberElement.textContent);

                if (event.target.id === "decrement" && quantity > 1) {
                    quantity--;
                } else if (event.target.id === "increment") {
                    quantity++;
                }

                numberElement.textContent = quantity;
                updateTotalPrice();
                saveCartToSession();
            });

            updateCartCount(1);
            updateTotalPrice();
            saveCartToSession();
        }

        function updateTotalPrice() {
            const totalPriceElement = document.querySelector(".total-price");
            const cartBoxes = cartContent.querySelectorAll(".cart-box");
            let total = 0;
            cartBoxes.forEach(cartBox => {
                const price = parseFloat(cartBox.querySelector(".cart-price").textContent.replace("$", ""));
                const quantity = parseInt(cartBox.querySelector(".number").textContent);
                total += price * quantity;
            });
            totalPriceElement.textContent = `$${total.toFixed(2)}`;
        }

        let cartItemCount = 0;
        function updateCartCount(change) {
            const cartItemCountBadge = document.querySelector(".cart-item-count");
            cartItemCount += change;
            cartItemCountBadge.textContent = cartItemCount > 0 ? cartItemCount : "";
            cartItemCountBadge.style.visibility = cartItemCount > 0 ? "visible" : "hidden";
        }

        document.querySelector(".btn-buy").addEventListener("click", () => {
            if (cartContent.querySelectorAll(".cart-box").length === 0) {
                alert("Your cart is empty. Please add items to your cart before buying.");
                return;
            }

            cartContent.innerHTML = "";
            cartItemCount = 0;
            updateCartCount(0);
            updateTotalPrice();
            sessionStorage.removeItem("cart");

            alert("Thank you for your order!");
        });

        document.querySelector(".btn-clear").addEventListener("click", () => {
            if (cartContent.querySelectorAll(".cart-box").length === 0) {
                alert("No items to clear. Your cart is already empty!");
                return;
            }

            cartContent.innerHTML = "";
            cartItemCount = 0;
            updateCartCount(0);
            updateTotalPrice();
            sessionStorage.removeItem("cart");

            alert("Cart Cleared!");
        });

        loadCartFromSession();
    }

    addItemsToCart();
}
