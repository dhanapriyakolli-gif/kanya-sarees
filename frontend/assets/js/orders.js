/* ==========================================
   ORDERS.JS
========================================== */


const ordersContainer =
    document.getElementById("ordersContainer");

const orderDetailsContainer =
    document.getElementById("orderDetailsContainer");

const successOrderId =
    document.getElementById("successOrderId");


/* ==========================================
   GET ORDERS FROM BACKEND
========================================== */

async function getOrders() {

    const token =
        localStorage.getItem("authToken");

    if (!token) {

        alert("Please login to view your orders");

        window.location.href = "login.html";

        return [];

    }

    try {

        const response = await fetch(
           `${API_BASE_URL}/api/products/my-orders/`,
            {
                method: "GET",

                headers: {
                    "Authorization": "Token " + token
                }
            }
        );

        if (!response.ok) {

            throw new Error("Failed to fetch orders");

        }

        const orders =
            await response.json();

        return orders;

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );

        if (ordersContainer) {

            ordersContainer.innerHTML = `
                <h2>Unable to load orders</h2>
                <p>Please try again later.</p>
            `;

        }

        return [];

    }

}


/* ==========================================
   ORDERS PAGE
========================================== */

if (ordersContainer) {

    displayOrders();

}


async function displayOrders() {

    const orders =
        await getOrders();

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <h2>No Orders Found</h2>
            <p>Start shopping to see your orders.</p>
        `;

        return;

    }


    orders.forEach(order => {

        const product =
            order.items[0];

        ordersContainer.innerHTML += `

        <div class="order-card">

            <img
                src="${product.image}"
                class="order-image"
                alt="${product.name}">

            <h3>
                Order ID: KHS${1000 + order.id}
            </h3>

            <p>
                Total: ₹${Number(order.total_amount).toLocaleString()}
            </p>

            <p>
                Status: ${order.status}
            </p>

            <a href="order-details.html?order=${order.id}">

                <button class="view-order-btn">
                    View Details
                </button>

            </a>

        </div>

        `;

    });

}


/* ==========================================
   ORDER DETAILS PAGE
========================================== */

if (orderDetailsContainer) {

    displayOrderDetails();

}


async function displayOrderDetails() {

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("order");

    const orders =
        await getOrders();

    const order =
        orders.find(
            item => String(item.id) === String(orderId)
        );


    if (!order) {

        orderDetailsContainer.innerHTML = `
            <h2>Order Not Found</h2>
        `;

        return;

    }


    orderDetailsContainer.innerHTML = `

    <div class="order-detail-card">

        <h2>
            Order ID: KHS${1000 + order.id}
        </h2>

        ${order.items.map(product => {

            const price =
                Number(product.price);

            const subtotal =
                Number(product.subtotal);

            return `

            <div class="order-product">

                <img
                    src="${product.image}"
                    class="order-detail-image"
                    alt="${product.name}">

                <div>

                    <h3>${product.name}</h3>

                    <p>
                        Quantity : ${product.quantity}
                    </p>

                    <p>
                        Price : ₹${price.toLocaleString()}
                    </p>

                    <p>
                        Subtotal : ₹${subtotal.toLocaleString()}
                    </p>

                </div>

            </div>

            `;

        }).join("")}


        <hr>

        <h3>
            Total :
            ₹${Number(order.total_amount).toLocaleString()}
        </h3>

        <p>
            Payment : ${order.payment_method}
        </p>

        <p>
            Status : ${order.status}
        </p>

        <p>
            Address : ${order.address}
        </p>

        <p>
            Date :
            ${new Date(order.created_at).toLocaleString()}
        </p>

    </div>

    `;

}

/* ==========================================
   ORDER SUCCESS PAGE
========================================== */

if (successOrderId) {

    displayLatestOrder();

}

async function displayLatestOrder() {

    const orders = await getOrders();

    if (orders.length > 0) {

        const latestOrder = orders[0];

        successOrderId.textContent =
            "Order ID: KHS" + (1000 + latestOrder.id);

    }

}