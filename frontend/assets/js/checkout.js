
/* ==========================================
   KANYA HOUSE OF SAREES
   CHECKOUT.JS
========================================== */


/* ==========================================
   GET ELEMENTS
========================================== */

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");


if (checkoutItems) {

    displayCheckout();

    loadCheckoutProfile();

}


if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        placeOrder
    );

}


/* ==========================================
   DISPLAY CHECKOUT
========================================== */

function displayCheckout() {

    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    checkoutItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<h3>Your Cart is Empty</h3>";

        checkoutTotal.textContent =
            "Total Amount: ₹0";

        return;

    }


    cart.forEach((product, index) => {

        let price =
            Number(
                String(product.price)
                    .replace(/[₹,]/g, "")
            );


        let subtotal =
            price * product.quantity;


        total += subtotal;


        checkoutItems.innerHTML += `

            <div class="checkout-product">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <div class="checkout-details">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price: ${product.price}
                    </p>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            onclick="checkoutDecrease(${index})">
                            -
                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="checkoutIncrease(${index})">
                            +
                        </button>

                    </div>

                    <p>
                        Subtotal:
                        ₹${subtotal.toLocaleString()}
                    </p>

                </div>

            </div>

        `;

    });


    checkoutTotal.textContent =
        `Total Amount: ₹${total.toLocaleString()}`;

}


/* ==========================================
   QUANTITY +
========================================== */

window.checkoutIncrease = async function(index) {

    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];

    if (!cart[index]) {
        return;
    }


    const productId =
        cart[index].id;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/${productId}/`
            );


        if (!response.ok) {

            alert("Unable to check stock.");

            return;

        }


        const product =
            await response.json();


        const stock =
            Number(product.stock);


        if (stock <= 0) {

            alert(
                "Sorry, this product is out of stock."
            );

            return;

        }


        if (cart[index].quantity >= stock) {

            alert(
                `Only ${stock} item(s) of "${cart[index].name}" are available.`
            );

            return;

        }


        cart[index].quantity++;


        localStorage.setItem(
            getCartKey(),
            JSON.stringify(cart)
        );


        displayCheckout();

        updateCartCount();

    }
    catch (error) {

        console.error(
            "Stock checking error:",
            error
        );

        alert(
            "Unable to check stock. Please make sure Django is running."
        );

    }

};

/* ==========================================
   QUANTITY -
========================================== */

window.checkoutDecrease = function(index) {

    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    if (!cart[index]) {
        return;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    displayCheckout();

    updateCartCount();

};


/* ==========================================
   LOAD PROFILE
   DJANGO + MYSQL
========================================== */

async function loadCheckoutProfile() {

    const token =
        localStorage.getItem("authToken");


    /* Check login token */

    if (!token) {

        alert(
            "Please login again."
        );

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
               `${API_BASE_URL}/api/accounts/profile/`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Token " + token
                    }
                }
            );


        const data =
            await response.json();


        /* ==========================================
           API ERROR
        ========================================== */

        if (!response.ok) {

            alert(
                data.error ||
                "Unable to load profile."
            );

            return;

        }


        /* ==========================================
           GET CHECKOUT ELEMENTS
        ========================================== */

        const fullName =
            document.getElementById("fullName");

        const mobile =
            document.getElementById("mobile");

        const address =
            document.getElementById("address");

        const city =
            document.getElementById("city");

        const pincode =
            document.getElementById("pincode");


        /* ==========================================
           DISPLAY PROFILE DATA
        ========================================== */

        if (fullName) {

            fullName.value =
                data.name || "";

        }


        if (mobile) {

            mobile.value =
                data.phone || "";

        }


        if (address) {

            address.value =
                data.address || "";

        }


        if (city) {

            city.value =
                data.city || "";

        }


        if (pincode) {

            pincode.value =
                data.pincode || "";

        }

    }


    catch (error) {

        console.error(
            "Checkout profile loading error:",
            error
        );


        alert(
            "Unable to connect to server. Please make sure Django is running."
        );

    }

}


/* ==========================================
   PLACE ORDER
   DJANGO + MYSQL
========================================== */

async function placeOrder() {

    const token =
        localStorage.getItem("authToken");


    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if (!token) {

        alert(
            "Please login to place an order."
        );

        window.location.href =
            "login.html";

        return;

    }


    /* ==========================================
       CHECK PAYMENT METHOD
    ========================================== */

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!payment) {

        alert(
            "Please select payment method."
        );

        return;

    }


    /* ==========================================
       GET CART
    ========================================== */

    const cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    /* ==========================================
       GET ADDRESS DETAILS
    ========================================== */

    const fullNameElement =
        document.getElementById("fullName");

    const mobileElement =
        document.getElementById("mobile");

    const addressElement =
        document.getElementById("address");

    const cityElement =
        document.getElementById("city");

    const pincodeElement =
        document.getElementById("pincode");


    const fullName =
        fullNameElement.value.trim();

    const mobile =
        mobileElement.value.trim();

    const address =
        addressElement.value.trim();

    const city =
        cityElement.value.trim();

    const pincode =
        pincodeElement.value.trim();


    /* ==========================================
       VALIDATE ADDRESS
    ========================================== */

    if (
        !fullName ||
        !mobile ||
        !address ||
        !city ||
        !pincode
    ) {

        alert(
            "Please fill all address details."
        );

        return;

    }


    /* ==========================================
       VALIDATE MOBILE
    ========================================== */

    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;

    }


    /* ==========================================
       VALIDATE PINCODE
    ========================================== */

    if (!/^[0-9]{6}$/.test(pincode)) {

        alert(
            "Please enter a valid 6-digit pincode."
        );

        return;

    }


    /* ==========================================
       CREATE DELIVERY ADDRESS
    ========================================== */

    const deliveryAddress =
        `${fullName}, ${mobile}, ${address}, ${city}, ${pincode}`;


    /* ==========================================
       CONVERT CART INTO DJANGO FORMAT
    ========================================== */

    const items =
        cart.map(product => ({

            product_id:
                Number(product.id),

            quantity:
                Number(product.quantity)

        }));


    console.log("Cart:", cart);

    console.log("Order items:", items);


    try {

        /* ==========================================
           SEND ORDER TO DJANGO
        ========================================== */

        const response =
            await fetch(
              `${API_BASE_URL}/api/products/place-order/`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Token " + token

                    },

                    body: JSON.stringify({

                        address:
                            deliveryAddress,

                        payment_method:
                            payment.value,

                        items:
                            items

                    })

                }
            );


        const data =
            await response.json();


        /* ==========================================
           HANDLE API ERROR
        ========================================== */

        if (!response.ok) {

            alert(
                data.error ||
                "Unable to place order."
            );

            return;

        }


        /* ==========================================
           ORDER SUCCESS
        ========================================== */

        localStorage.removeItem(getCartKey());

        updateCartCount();


        alert(
            "Order placed successfully!"
        );


        console.log(
            "Order ID:",
            data.order_id
        );


        window.location.href =
            "order-success.html";

    }


    catch (error) {

        console.error(
            "Order error:",
            error
        );


        alert(
            "Unable to connect to server. Please make sure Django is running."
        );

    }

}

