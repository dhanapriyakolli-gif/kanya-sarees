
/* ==========================================
   KANYA HOUSE OF SAREES
   COMMON.JS
========================================== */

const API_BASE_URL = "https://kanya-sarees-backend.onrender.com";
/* ==========================================
   LOGIN CHECK
========================================== */

function checkLogin(){

    return localStorage.getItem("loggedInUser") !== null;

}




/* ==========================================
   USER-SPECIFIC STORAGE KEYS
========================================== */

function getCurrentUserEmail(){

    const loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if(!loggedInUser){

        return null;

    }

    return loggedInUser.email;

}


function getCartKey(){

    const email =
        getCurrentUserEmail();

    if(!email){

        return "cart";

    }

    return "cart_" + email;

}


function getWishlistKey(){

    const email =
        getCurrentUserEmail();

    if(!email){

        return "wishlist";

    }

    return "wishlist_" + email;

}


// Make available to other JS files

window.getCartKey = getCartKey;
window.getWishlistKey = getWishlistKey;



/* ==========================================
   PROTECTED PAGES
========================================== */

const protectedPages = [
    "profile.html",
    "checkout.html",
    "orders.html"
];

const currentPage =
window.location.pathname.split("/").pop();

if(protectedPages.includes(currentPage)){

    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href = "login.html";

    }

}



/* ==========================================
   CART COUNT
========================================== */

function updateCartCount(){

    const cartCount =
        document.getElementById("cartCount");

    if(!cartCount) return;


    // Show cart count only when user is logged in
    if(!checkLogin()){

        cartCount.textContent = 0;

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    let totalItems = 0;


    cart.forEach(item => {

        totalItems += item.quantity;

    });


    cartCount.textContent = totalItems;

}





/* ==========================================
   WISHLIST COUNT
========================================== */

function updateWishlistCount(){

    const wishlistCount =
        document.getElementById("wishlistCount");

    if(!wishlistCount) return;


    // Show wishlist count only when user is logged in
    if(!checkLogin()){

        wishlistCount.textContent = 0;

        return;

    }


    let wishlist =
        JSON.parse(
            localStorage.getItem(getWishlistKey())
        ) || [];


    wishlistCount.textContent =
        wishlist.length;

}






/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    updateWishlistCount();

});

