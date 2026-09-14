/* ==========================================
   WISHLIST.JS
========================================== */




/* ==========================================
   ADD / REMOVE WISHLIST
   Works with dynamically loaded products
========================================== */

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(".wishlist-btn");

    if (!button) {
        return;
    }


    const card =
        button.closest(".product-card");

    if (!card) {
        return;
    }


    if (!checkLogin()) {

        alert("Please login to add wishlist");

        window.location.href = "login.html";

        return;

    }


    const product = {

        name:
            card.querySelector("h3").textContent.trim(),

        price:
            card.querySelector(".price").textContent.trim(),

        image:
            card.querySelector("img").src

    };


    /* ==========================================
       GET CURRENT USER'S WISHLIST
    ========================================== */

    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    const exists =
        wishlist.some(
            item => item.name === product.name
        );


    if (exists) {

        wishlist =
            wishlist.filter(
                item => item.name !== product.name
            );

    } else {

        wishlist.push(product);

    }


    /* ==========================================
       SAVE CURRENT USER'S WISHLIST
    ========================================== */

    localStorage.setItem(
        getWishlistKey(),
        JSON.stringify(wishlist)
    );


    updateWishlistIcon(
        button,
        product.name
    );


    updateWishlistCount();

});


/* ==========================================
   CHANGE HEART ICON
========================================== */

function updateWishlistIcon(button, productName) {

    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    const image =
        button.querySelector("img");

    if (!image) {
        return;
    }


    const exists =
        wishlist.some(
            item => item.name === productName
        );


    image.src = exists
        ? "../assets/images/heart-filled.png"
        : "../assets/images/wishlist.png";

}


/* ==========================================
   DISPLAY WISHLIST
========================================== */

const wishlistContainer =
    document.getElementById("wishlistContainer");


if (wishlistContainer) {

    displayWishlist();

}


function displayWishlist() {

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if (!checkLogin()) {

        alert("Please login to view your wishlist");

        window.location.href = "login.html";

        return;

    }


    /* ==========================================
       GET CURRENT USER'S WISHLIST
    ========================================== */

    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    wishlistContainer.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `
            <h2>Your Wishlist is Empty</h2>
        `;

        return;

    }


    wishlist.forEach((product, index) => {

        wishlistContainer.innerHTML += `

        <div class="cart-item">

            <img
                src="${product.image}"
                alt="${product.name}">


            <div class="cart-details">

                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.price}
                </p>


                <div class="product-buttons">

                    <button
                        class="cart-btn"
                        onclick="moveWishlistToCart(${index})">

                        <img
                            src="../assets/images/cart.png"
                            alt="Cart">

                    </button>


                    <button
                        class="remove-btn"
                        onclick="removeWishlistItem(${index})">

                        <img
                            src="../assets/images/delete.png"
                            alt="Delete">

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}


/* ==========================================
   REMOVE WISHLIST ITEM
========================================== */

window.removeWishlistItem = function(index) {

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if (!checkLogin()) {

        alert("Please login to continue");

        window.location.href = "login.html";

        return;

    }


    /* ==========================================
       GET CURRENT USER'S WISHLIST
    ========================================== */

    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    wishlist.splice(index, 1);


    localStorage.setItem(
        getWishlistKey(),
        JSON.stringify(wishlist)
    );


    displayWishlist();

    updateWishlistCount();

};


/* ==========================================
   MOVE TO CART
========================================== */

window.moveWishlistToCart = async function(index) {

    /* ==========================================
       CHECK LOGIN FIRST
    ========================================== */

    if (!checkLogin()) {

        alert("Please login to add items");

        window.location.href = "login.html";

        return;

    }


    /* ==========================================
       GET CURRENT USER'S WISHLIST
    ========================================== */

    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    /* ==========================================
       GET CURRENT USER'S CART
    ========================================== */

    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    const product =
        wishlist[index];

    if (!product) {
        return;
    }


    /* ==========================================
       CHECK CURRENT PRODUCT STOCK
    ========================================== */

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/?search=${encodeURIComponent(product.name)}`
            );

        if (!response.ok) {

            alert("Unable to check product stock.");

            return;

        }


        const products =
            await response.json();


        const productData =
            products.find(
                item => item.name === product.name
            );


        if (!productData) {

            alert("Product not found.");

            return;

        }


        const stock =
            Number(productData.stock);


        if (stock <= 0) {

            alert("Sorry, this product is out of stock.");

            return;

        }


        const existing =
            cart.find(
                item => item.name === product.name
            );


      if (existing) {

    if (existing.quantity >= stock) {

        alert(
            `Only ${stock} item(s) of "${product.name}" are available.`
        );

        return;

    }

    existing.quantity++;

} else {

    product.quantity = 1;

    cart.push(product);

}


        /* ==========================================
           SAVE CURRENT USER'S CART
        ========================================== */

        localStorage.setItem(
            getCartKey(),
            JSON.stringify(cart)
        );


        /* ==========================================
           REMOVE FROM CURRENT USER'S WISHLIST
        ========================================== */

        wishlist.splice(index, 1);


        localStorage.setItem(
            getWishlistKey(),
            JSON.stringify(wishlist)
        );


        displayWishlist();

        updateCartCount();

        updateWishlistCount();


        alert("Moved to Cart");

    }
    catch(error) {

        console.error(
            "Stock checking error:",
            error
        );

        alert(
            "Unable to check stock. Please make sure Django is running."
        );

    }

};