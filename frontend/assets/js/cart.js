
/* ==========================================
   KANYA HOUSE OF SAREES
   CART.JS
========================================== */


/* ==========================================
   ADD TO CART
   Works with dynamically loaded products
========================================== */

document.addEventListener("click", async function(event){

    const button =
        event.target.closest(".cart-btn");

    if(!button){
        return;
    }


    if(!checkLogin()){

        alert("Please login to add items");

        window.location.href = "login.html";

        return;

    }


    const card =
        button.closest(".product-card");


    if(!card){
        return;
    }


    const productId =
        Number(card.dataset.productId);


    /* ==========================================
       GET CURRENT STOCK FROM BACKEND
    ========================================== */

    let stock;

    try{

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/${productId}/`
            );


        if(!response.ok){

            alert(
                "Unable to check product stock."
            );

            return;

        }


        const productData =
            await response.json();


        stock =
            Number(productData.stock);

    }

    catch(error){

        console.error(
            "Stock checking error:",
            error
        );


        alert(
            "Unable to check stock. Please make sure Django is running."
        );

        return;

    }


    /* ==========================================
       OUT OF STOCK
    ========================================== */

    if(stock <= 0){

        alert(
            "Sorry, this product is out of stock."
        );

        return;

    }


    const product = {

        id:
            productId,

        name:
            card.querySelector("h3").textContent.trim(),

        price:
            card.querySelector(".price").textContent.trim(),

        image:
            card.querySelector("img").src,

        quantity: 1

    };


    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    const existingProduct =
        cart.find(item => item.id === product.id);


    /* ==========================================
       CHECK EXISTING CART QUANTITY
    ========================================== */

    if(existingProduct){

        if(existingProduct.quantity >= stock){

            alert(
                `Only ${stock} item(s) of "${product.name}" are available.`
            );

            return;

        }


        existingProduct.quantity++;

    }

    else{

        cart.push(product);

    }


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        product.name + " added to cart!"
    );

});



/* ==========================================
   CART ELEMENTS
========================================== */

const cartContainer =
    document.getElementById("cartContainer");

const cartTotal =
    document.getElementById("cartTotal");



/* ==========================================
   DISPLAY CART
========================================== */

if(cartContainer){

    displayCart();

}


async function displayCart(){

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if(!checkLogin()){

        alert("Please login to view your cart");

        window.location.href = "login.html";

        return;

    }


    /* ==========================================
       GET CART FROM USER-SPECIFIC STORAGE
    ========================================== */

    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    cartContainer.innerHTML = "";


    /* ==========================================
       TOTAL
    ========================================== */

    let total = 0;


    /* ==========================================
       EMPTY CART
    ========================================== */

    if(cart.length === 0){

        cartContainer.innerHTML =
            "<h2>Your Cart is Empty</h2>";


        if(cartTotal){

            cartTotal.textContent =
                "Total: ₹0";

        }

        return;

    }


    /* ==========================================
       DISPLAY EACH CART PRODUCT
    ========================================== */

    for(let index = 0; index < cart.length; index++){

        const product = cart[index];


        /* ==========================================
           GET PRICE
        ========================================== */

        let price =
            Number(
                product.price.replace(/[₹,]/g,"")
            );


        let subtotal =
            price * product.quantity;


        total += subtotal;


        /* ==========================================
           GET CURRENT STOCK
        ========================================== */

        let stock = null;


        try{

            const response =
                await fetch(
                    `${API_BASE_URL}/api/products/${product.id}/`
                );


            if(response.ok){

                const productData =
                    await response.json();


                stock =
                    Number(productData.stock);

            }

        }

        catch(error){

            console.error(
                "Unable to get product stock:",
                error
            );

        }


        /* ==========================================
           STOCK MESSAGE
        ========================================== */

        let stockMessage = "";


        if(stock === 0){

            stockMessage =
                `<p class="stock-status out-of-stock">
                    ✕ Out of Stock
                </p>`;

        }

        else if(stock !== null && stock <= 5){

            stockMessage =
                `<p class="stock-status low-stock">
                    ⚠ Only ${stock} left
                </p>`;

        }

        else if(stock !== null){

            stockMessage =
                `<p class="stock-status in-stock">
                    ✓ In Stock
                </p>`;

        }


        /* ==========================================
           CART ITEM HTML
        ========================================== */

        cartContainer.innerHTML += `

        <div class="cart-item">

            <img src="${product.image}">

            <div class="cart-details">

                <h3>${product.name}</h3>

                <p>${product.price}</p>

                ${stockMessage}


                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})">
                        -
                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>


                <p>
                    Subtotal:
                    ₹${subtotal.toLocaleString()}
                </p>


                <button
                    class="remove-btn"
                    onclick="removeCartItem(${index})">

                    <img
                        src="../assets/images/delete.png">

                </button>

            </div>

        </div>

        `;

    }


    /* ==========================================
       UPDATE CART TOTAL
    ========================================== */

    if(cartTotal){

        cartTotal.textContent =
            `Total: ₹${total.toLocaleString()}`;

    }

}



/* ==========================================
   INCREASE QUANTITY
========================================== */

window.increaseQuantity = async function(index){

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href = "login.html";

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    if(!cart[index]){

        return;

    }


    const productId =
        cart[index].id;


    /* ==========================================
       GET CURRENT STOCK
    ========================================== */

    try{

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/${productId}/`
            );


        if(!response.ok){

            alert(
                "Unable to check stock."
            );

            return;

        }


        const product =
            await response.json();


        const stock =
            Number(product.stock);


        /* ==========================================
           OUT OF STOCK
        ========================================== */

        if(stock <= 0){

            alert(
                "Sorry, this product is out of stock."
            );

            return;

        }


        /* ==========================================
           STOCK LIMIT
        ========================================== */

        if(cart[index].quantity >= stock){

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


        displayCart();

        updateCartCount();

    }

    catch(error){

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
   DECREASE QUANTITY
========================================== */

window.decreaseQuantity = function(index){

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href = "login.html";

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    if(!cart[index]){

        return;

    }


    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }

    else{

        cart.splice(index,1);

    }


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    displayCart();

    updateCartCount();

};



/* ==========================================
   REMOVE CART ITEM
========================================== */

window.removeCartItem = function(index){

    /* ==========================================
       CHECK LOGIN
    ========================================== */

    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href = "login.html";

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem(getCartKey())
        ) || [];


    if(!cart[index]){

        return;

    }


    cart.splice(index,1);


    localStorage.setItem(
        getCartKey(),
        JSON.stringify(cart)
    );


    displayCart();

    updateCartCount();

};



/* ==========================================
   BUY NOW
   Works with dynamically loaded products
========================================== */

document.addEventListener("click", async function(event){

    const button =
        event.target.closest(".buy-btn");


    if(!button){

        return;

    }


    /* ==========================================
       LOGIN CHECK
    ========================================== */

    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href = "login.html";

        return;

    }


    const card =
        button.closest(".product-card");


    if(!card){

        return;

    }


    const productId =
        Number(card.dataset.productId);


    /* ==========================================
       CHECK CURRENT STOCK
    ========================================== */

    try{

        const response =
            await fetch(
                 `${API_BASE_URL}/api/products/${productId}/`
            );


        if(!response.ok){

            alert(
                "Unable to check product stock."
            );

            return;

        }


        const productData =
            await response.json();


        const stock =
            Number(productData.stock);


        /* ==========================================
           OUT OF STOCK
        ========================================== */

        if(stock <= 0){

            alert(
                "Sorry, this product is out of stock."
            );

            return;

        }


        const product = {

            id:
                productId,

            name:
                card.querySelector("h3").textContent.trim(),

            price:
                card.querySelector(".price").textContent.trim(),

            image:
                card.querySelector("img").src,

            quantity: 1

        };


        let cart =
            JSON.parse(
                localStorage.getItem(getCartKey())
            ) || [];


        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );


        /* ==========================================
           CHECK EXISTING QUANTITY
        ========================================== */

        if(existing){

            if(existing.quantity >= stock){

                alert(
                    `Only ${stock} item(s) of "${product.name}" are available.`
                );

                return;

            }


            existing.quantity++;

        }

        else{

            cart.push(product);

        }


        localStorage.setItem(
            getCartKey(),
            JSON.stringify(cart)
        );


        updateCartCount();


        window.location.href =
            "checkout.html";

    }

    catch(error){

        console.error(
            "Stock checking error:",
            error
        );


        alert(
            "Unable to check stock. Please make sure Django is running."
        );

    }

});

