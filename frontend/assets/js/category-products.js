/* ==========================================
   KANYA HOUSE OF SAREES
   CATEGORY-PRODUCTS.JS
========================================== */


const productGrid =
    document.querySelector(".product-grid");


async function loadCategoryProducts() {

    try {

        // Get category from the page title
        const pageTitle =
            document.querySelector(
                ".products-page h1"
            ).textContent;

        // Example:
        // "Cotton Sarees Collection" → "Cotton"
        // "Silk Sarees Collection" → "Silk"

        const category =
            pageTitle
                .replace("Sarees Collection", "")
                .trim();


        const response =
            await fetch(
                `${API_BASE_URL}/api/products/?category=${encodeURIComponent(category)}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load category products"
            );

        }


        const products =
            await response.json();


        displayCategoryProducts(products);


    } catch (error) {

        console.error(
            "Error loading category products:",
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
   DISPLAY CATEGORY PRODUCTS
========================================== */

function displayCategoryProducts(products) {

    productGrid.innerHTML = "";


    if (products.length === 0) {

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


        if (product.stock === 0) {

            stockMessage = `
                <p class="stock out-of-stock">
                    ✕ Out of Stock
                </p>
            `;

        }
        else if (product.stock <= 5) {

            stockMessage = `
                <p class="stock low-stock">
                    ⚠ Only ${product.stock} left
                </p>
            `;

        }
        else {

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


/* ==========================================
   LOAD CATEGORY PRODUCTS
========================================== */

loadCategoryProducts();