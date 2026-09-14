/* ==========================================
   KANYA HOUSE OF SAREES
   PRODUCTS.JS
========================================== */


/* ==========================================
   GET PRODUCTS FROM DJANGO API
========================================== */

const productGrid =
    document.querySelector(".product-grid");


if(productGrid){

    loadProducts();

}


async function loadProducts(){

    try{

        const response =
            await fetch(
                `${API_BASE_URL}/api/products/`
            );

        if(!response.ok){

            throw new Error(
                "Failed to load products"
            );

        }

        const products =
            await response.json();

        displayProducts(products);

    }
    catch(error){

        console.error(
            "Error loading products:",
            error
        );

        productGrid.innerHTML = `
            <p>
                Unable to load products.
                Please try again.
            </p>
        `;

    }

}


/* ==========================================
   DISPLAY PRODUCTS
========================================== */

function displayProducts(products){

    productGrid.innerHTML = "";

    if(products.length === 0){

        productGrid.innerHTML = `
            <h2>No Products Available</h2>
        `;

        return;

    }


    products.forEach(product => {

        /* ==========================================
           STOCK MESSAGE
        ========================================== */

        let stockMessage = "";

        if(product.stock === 0){

            stockMessage = `
                <p class="stock out-of-stock">
                    ✕ Out of Stock
                </p>
            `;

        }
        else if(product.stock <= 5){

            stockMessage = `
                <p class="stock low-stock">
                    ⚠ Only ${product.stock} left
                </p>
            `;

        }
        else{

            stockMessage = `
                <p class="stock in-stock">
                    ✓ In Stock
                </p>
            `;

        }


        /* ==========================================
           PRODUCT CARD
        ========================================== */

        productGrid.innerHTML += `

            <div
                class="product-card"
                data-product-id="${product.id}">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <h3>${product.name}</h3>

                <p class="price">
                    ₹${Number(product.price).toLocaleString()}
                </p>

                ${stockMessage}


                <div class="product-buttons">

                    <button
                        class="cart-btn"
                        type="button">

                        <img
                            src="../assets/images/cart.png"
                            alt="Add to Cart">

                    </button>


                    <button
                        class="wishlist-btn"
                        type="button">

                        <img
                            src="../assets/images/wishlist.png"
                            alt="Add to Wishlist">

                    </button>


                    <button
                        class="buy-btn"
                        type="button">

                        <img
                            src="../assets/images/buy-button.png"
                            alt="Buy Now">

                    </button>

                </div>

            </div>

        `;

    });

}