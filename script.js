// ================= HS SHOPPING SCRIPT =================

let cart = JSON.parse(localStorage.getItem("hsCart")) || [];
let orders = JSON.parse(localStorage.getItem("hsOrders")) || [];


// ================= ELEMENTS =================

const cartCount = document.querySelector(".cart-count");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutTotal = document.getElementById("checkout-total");


// ================= CART =================

function updateCart() {

    // Cart count
    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }

    // Cart items
    if (cartItems) {

        cartItems.innerHTML = "";

        if (cart.length === 0) {

            cartItems.innerHTML = "<p>Your cart is empty.</p>";

        } else {

            cart.forEach((item, index) => {

                const div = document.createElement("div");

                div.className = "cart-item";

                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">

                    <div class="cart-item-info">

                        <h3>${item.name}</h3>

                        <p>₹${item.price}</p>

                        <div class="quantity-controls">

                            <button onclick="decreaseQuantity(${index})">
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button onclick="increaseQuantity(${index})">
                                +
                            </button>

                        </div>

                        <button
                            class="remove-cart"
                            onclick="removeFromCart(${index})">
                            Remove
                        </button>

                    </div>
                `;

                cartItems.appendChild(div);
            });
        }
    }

    // Total
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartTotal) {
        cartTotal.textContent = total;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = total;
    }

    localStorage.setItem("hsCart", JSON.stringify(cart));
}

// ================= ADD TO CART =================

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existingProduct = cart.find(
            item => item.name === name
        );

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        // Cart ko localStorage me save/update karo
        updateCart();

        // Cart webpage open karo
        window.location.href = "cart.html";
    });

});


// ================= QUANTITY =================

function increaseQuantity(index) {

    if (cart[index]) {

        cart[index].quantity++;

        updateCart();
    }
}


function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    updateCart();
}


function removeFromCart(index) {

    if (cart[index]) {

        cart.splice(index, 1);

        updateCart();
    }
}


// ================= SHOW SECTIONS =================

function showSection(id) {

    const sections = [
        "customer-section",
        "registry-section",
        "gift-section",
        "sell-section",
        "cart-section",
        "checkout-section",
        "orders-section"
    ];

    sections.forEach(sectionId => {

        const section = document.getElementById(sectionId);

        if (section) {
            section.classList.remove("active");
        }
    });


    const section = document.getElementById(id);

    if (section) {

        section.classList.add("active");

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ================= CART =================

const cartBtn = document.getElementById("cart-btn");

if (cartBtn) {
    cartBtn.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
}

// ================= BUY NOW =================

document.querySelectorAll(".buy-now").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        // Selected product save karo
        const buyNowProduct = {
            name: name,
            price: price,
            image: image,
            quantity: 1
        };

        localStorage.setItem(
            "hsBuyNow",
            JSON.stringify(buyNowProduct)
        );

        // Buy Now page open
        window.location.href = "buy-now.html";

    });

});

// ================= SEARCH =================

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const categorySelect = document.getElementById("category-select");


function searchProducts() {

    if (!searchInput || !categorySelect) return;

    const searchText =
        searchInput.value.toLowerCase().trim();

    const category =
        categorySelect.value;


    document.querySelectorAll(".box").forEach(product => {

        const name =
            (product.dataset.name || "").toLowerCase();

        const productCategory =
            product.dataset.category || "";

        const nameMatch =
            name.includes(searchText);

        const categoryMatch =
            category === "all" ||
            productCategory === category;


        product.style.display =
            nameMatch && categoryMatch
                ? ""
                : "none";
    });
}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchProducts
    );
}


if (searchInput) {

    searchInput.addEventListener("keyup", event => {

        if (event.key === "Enter") {

            searchProducts();
        }
    });
}


if (categorySelect) {

    categorySelect.addEventListener(
        "change",
        searchProducts
    );
}

// ================= ALL PRODUCTS =================

const allBtn = document.getElementById("all-btn");

if (allBtn) {
    allBtn.addEventListener("click", () => {
        window.location.href = "all.html";
    });
}


// ================= LOCATION =================

const deliverAddress =
    document.getElementById("deliver-address");

const locationPopup =
    document.getElementById("location-popup");

const closeLocation =
    document.getElementById("close-location");

const saveLocation =
    document.getElementById("save-location");

const pincode =
    document.getElementById("pincode");

const locationMessage =
    document.getElementById("location-message");


if (deliverAddress && locationPopup) {

    deliverAddress.addEventListener("click", () => {

        locationPopup.classList.add("active");
    });
}


if (closeLocation && locationPopup) {

    closeLocation.addEventListener("click", () => {

        locationPopup.classList.remove("active");
    });
}


if (saveLocation) {

    saveLocation.addEventListener("click", () => {

        if (!pincode) return;

        const pin =
            pincode.value.trim();


        if (!/^\d{6}$/.test(pin)) {

            if (locationMessage) {

                locationMessage.textContent =
                    "Please enter a valid 6-digit PIN code.";
            }

            return;
        }


        localStorage.setItem(
            "hsPincode",
            pin
        );


        if (locationMessage) {

            locationMessage.textContent =
                "Location saved successfully!";
        }


        const locationText =
            document.querySelector(".add-second");


        if (locationText) {

            locationText.textContent = pin;
        }


        setTimeout(() => {

            if (locationPopup) {

                locationPopup.classList.remove("active");
            }

        }, 1000);
    });
}


// Saved pincode

const savedPincode =
    localStorage.getItem("hsPincode");


if (savedPincode) {

    const locationText =
        document.querySelector(".add-second");

    if (locationText) {

        locationText.textContent =
            savedPincode;
    }
}

// ================= SIGN IN =================

const signinBtn = document.getElementById("signin-btn");

if (signinBtn) {

    signinBtn.addEventListener("click", () => {

        window.location.href = "login.html";

    });

}

// ================= TODAY'S DEALS =================

const dealsBtn = document.getElementById("deals-btn");

if (dealsBtn) {

    dealsBtn.addEventListener("click", () => {

        window.location.href = "deals.html";

    });

}

// ================= CUSTOMER SERVICE =================

const customerBtn = document.getElementById("customer-btn");

if (customerBtn) {
    customerBtn.addEventListener("click", () => {
        window.location.href = "customer-service.html";
    });
}

// ================= REGISTRY =================

const registryBtn = document.getElementById("registry-btn");

if (registryBtn) {
    registryBtn.addEventListener("click", () => {
        window.location.href = "registry.html";
    });
}

const createRegistry =
    document.getElementById("create-registry");

if (createRegistry) {

    createRegistry.addEventListener("click", () => {

        alert("Your registry has been created!");
    });
}

// ================= GIFT CARDS =================

const giftBtn = document.getElementById("gift-btn");

if (giftBtn) {
    giftBtn.addEventListener("click", () => {
        window.location.href = "gift-cards.html";
    });
}

// ================= SELL =================

const sellBtn = document.getElementById("sell-btn");

if (sellBtn) {
    sellBtn.addEventListener("click", () => {
        window.location.href = "sell.html";
    });
}

const startSelling =
    document.getElementById("start-selling");

if (startSelling) {

    startSelling.addEventListener("click", () => {

        const message =
            document.getElementById("sell-message");


        if (message) {

            message.textContent =
                "Seller registration started!";
        }
    });
}


// ================= RETURNS & ORDERS =================

const ordersBtn = document.getElementById("orders-btn");

if (ordersBtn) {
    ordersBtn.addEventListener("click", () => {
        window.location.href = "orders.html";
    });
}

function displayOrders() {

    const ordersContainer =
        document.getElementById("orders-container");


    if (!ordersContainer) return;


    ordersContainer.innerHTML = "";


    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>No orders found.</p>";

        return;
    }


    orders.slice().reverse().forEach(order => {

        const div =
            document.createElement("div");


        div.className = "order-item";


        div.innerHTML = `
            <h3>Order #${order.id}</h3>

            <p>Date: ${order.date}</p>

            <p>Total: ₹${order.total}</p>

            <p>
                Payment:
                ${
                    order.payment === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"
                }
            </p>

            <p>
                Address: ${order.address}
            </p>
        `;


        ordersContainer.appendChild(div);
    });
}


// ================= CHECKOUT =================

const checkoutBtn =
    document.getElementById("checkout-btn");


if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        updateCart();

        showSection("checkout-section");
    });
}


// ================= PLACE ORDER =================

const placeOrder =
    document.getElementById("place-order");


if (placeOrder) {

    placeOrder.addEventListener("click", () => {

        const addressInput =
            document.getElementById("address");

        const paymentInput =
            document.getElementById("payment-method");


        const address =
            addressInput
            ? addressInput.value.trim()
            : "";


        const payment =
            paymentInput
            ? paymentInput.value
            : "cod";


        if (address === "") {

            alert(
                "Please enter your delivery address."
            );

            return;
        }


        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );


        const order = {

            id: Date.now(),

            items: [...cart],

            total: total,

            address: address,

            payment: payment,

            date: new Date().toLocaleString()
        };


        orders.push(order);


        localStorage.setItem(
            "hsOrders",
            JSON.stringify(orders)
        );


        cart = [];


        localStorage.setItem(
            "hsCart",
            JSON.stringify(cart)
        );


        updateCart();


        if (addressInput) {

            addressInput.value = "";
        }


        alert("Order placed successfully!");


        displayOrders();

        showSection("orders-section");
    });
}


// ================= SHOP NOW =================

const shopNow =
    document.getElementById("shop-now");


if (shopNow) {

    shopNow.addEventListener("click", event => {

        event.preventDefault();


        const productsSection =
            document.getElementById("products-section");


        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}


// ================= BACK TO TOP =================

const backToTop =
    document.getElementById("back-to-top");


if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ================= FOOTER HELP =================

const footerHelp =
    document.getElementById("footer-help");


if (footerHelp) {

    footerHelp.addEventListener("click", () => {

        showSection("customer-section");
    });
}
// ================= BACKEND CONNECTION =================

async function loadBackendProducts() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/products"
        );

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }

        const products = await response.json();

        console.log(
            "Backend Products:",
            products
        );

        const container =
            document.getElementById("backend-products");

        if (container) {

            container.innerHTML = "";

            products
                .filter(product => product.category === "health")
                .forEach(product => {

                    const div =
                        document.createElement("div");

                    div.className = "backend-product";

                    div.innerHTML = `
                        <h2>${product.title}</h2>

                        <img
                            src="${product.image}"
                            alt="${product.title}"
                        >

                        <p>₹${product.price}</p>

                        <p>${product.description}</p>

                        <p>
                            Category: ${product.category}
                        </p>

                        <button
                            class="add-cart"
                            data-name="${product.title}"
                            data-price="${product.price}"
                            data-image="${product.image}">
                            Add to Cart
                        </button>

                        <button
                            class="buy-now"
                            data-name="${product.title}"
                            data-price="${product.price}"
                            data-image="${product.image}">
                            Buy Now
                        </button>
                    `;

                    container.appendChild(div);

                    // ================= ADD TO CART =================

                    const addButton =
                        div.querySelector(".add-cart");

                    addButton.addEventListener("click", () => {

                        const name =
                            addButton.dataset.name;

                        const price =
                            Number(addButton.dataset.price);

                        const image =
                            addButton.dataset.image;

                        const existingProduct =
                            cart.find(
                                item => item.name === name
                            );

                        if (existingProduct) {

                            existingProduct.quantity++;

                        } else {

                            cart.push({
                                name: name,
                                price: price,
                                image: image,
                                quantity: 1
                            });
                        }

                        updateCart();

                        window.location.href =
                            "cart.html";
                    });


                    // ================= BUY NOW =================

                    const buyButton =
                        div.querySelector(".buy-now");

                    buyButton.addEventListener("click", () => {

                        const name =
                            buyButton.dataset.name;

                        const price =
                            Number(buyButton.dataset.price);

                        const image =
                            buyButton.dataset.image;

                        localStorage.setItem(
                            "buyNowProduct",
                            JSON.stringify({
                                name: name,
                                price: price,
                                image: image,
                                quantity: 1
                            })
                        );

                        window.location.href =
                            "buy-now.html";
                    });

                });
        }

    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );
    }
}


// ================= START =================

updateCart();

displayOrders();

loadBackendProducts();



// ================= HERO IMAGE SLIDER =================

const heroSlides = document.querySelectorAll(".hero-slide");

let heroIndex = 0;


heroSlides[heroIndex].classList.add("active");


setInterval(() => {

    heroSlides[heroIndex].classList.remove("active");

    heroIndex++;

    if (heroIndex >= heroSlides.length) {
        heroIndex = 0;
    }

    heroSlides[heroIndex].classList.add("active");

}, 4000);

// ================= HERO IMAGE SLIDER =================

document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");

    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (slides.length === 0) return;

    let currentSlide = 0;

    // Show slide
    function showSlide(index) {

        if (index >= slides.length) {
            currentSlide = 0;
        }

        if (index < 0) {
            currentSlide = slides.length - 1;
        }

        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        slides[currentSlide].classList.add("active");

        if (dots[currentSlide]) {
            dots[currentSlide].classList.add("active");
        }
    }


    // Next button
    nextBtn.addEventListener("click", () => {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    });


    // Previous button
    prevBtn.addEventListener("click", () => {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    });


    // Dots click
    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            currentSlide = index;

            showSlide(currentSlide);
        });

    });


    // Automatic slider
    setInterval(() => {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);

    }, 4000);


    // First slide
    showSlide(0);

});

// ================= HEALTH PRODUCTS =================

function openHealthProducts() {

    const healthSection = document.getElementById("health-products-section");

    if (healthSection) {

        healthSection.style.display = "block";

        healthSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ================= DARK MODE =================

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    const button = document.getElementById("dark-mode-btn");

    if (document.body.classList.contains("dark-mode")) {
        button.innerHTML = "☀️";
        localStorage.setItem("darkMode", "enabled");
    } else {
        button.innerHTML = "🌙";
        localStorage.setItem("darkMode", "disabled");
    }
}

// Remember user's choice
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");

    const button = document.getElementById("dark-mode-btn");

    if (button) {
        button.innerHTML = "☀️";
    }
}