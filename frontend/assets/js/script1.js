/* ==========================================
   KANYA HOUSE OF SAREES
   CLEAN SCRIPT.JS
========================================== */


/* ==========================================
   LOGIN CHECK
========================================== */

function checkLogin(){

    return localStorage.getItem("loggedInUser") !== null;

}



/* ==========================================
   PAGE PROTECTION
========================================== */


const protectedPages = [

    "profile.html",
    "checkout.html",
    "orders.html"

];


const currentPage = window.location.pathname.split("/").pop();



if(protectedPages.includes(currentPage)){


    if(!checkLogin()){

        alert("Please login to continue");

        window.location.href="login.html";

    }

}




/* ==========================================
   SIGNUP
========================================== */


const signupForm = document.getElementById("signupForm");


if(signupForm){


signupForm.addEventListener("submit",function(e){


e.preventDefault();



const user={


    name:
    document.getElementById("signupName").value.trim(),


    email:
    document.getElementById("signupEmail").value.trim(),


    phone:
    document.getElementById("signupPhone").value.trim(),


    password:
    document.getElementById("signupPassword").value


};



const confirmPassword =
document.getElementById("confirmPassword").value;



if(user.password !== confirmPassword){


    alert("Password does not match");

    return;

}



localStorage.setItem(
    "user",
    JSON.stringify(user)
);



alert("Signup Successful!");

window.location.href="login.html";


});


}






/* ==========================================
   LOGIN
========================================== */


const loginForm =
document.getElementById("loginForm");



if(loginForm){


loginForm.addEventListener("submit",function(e){


e.preventDefault();



const email =
document.getElementById("loginEmail").value.trim();



const password =
document.getElementById("loginPassword").value;



const savedUser =
JSON.parse(localStorage.getItem("user"));



if(!savedUser){


alert("Please signup first");

return;


}



if(
email===savedUser.email &&
password===savedUser.password
){



localStorage.setItem(

"loggedInUser",

JSON.stringify(savedUser)

);



const profile={


name:savedUser.name,

email:savedUser.email,

phone:savedUser.phone,

address:"",

city:"",

pincode:""


};



localStorage.setItem(

"profile",

JSON.stringify(profile)

);



alert("Login Successful!");

window.location.href="index.html";



}

else{


alert("Invalid Email or Password");


}


});


}
/* ==========================================
   FORGOT PASSWORD
========================================== */

const forgotPasswordForm =
document.getElementById("forgotPasswordForm");


if(forgotPasswordForm){


forgotPasswordForm.addEventListener("submit",function(e){


e.preventDefault();



const email =
document.getElementById("forgotEmail").value.trim();


const newPassword =
document.getElementById("newPassword").value;


const confirmPassword =
document.getElementById("confirmNewPassword").value;



// Get registered user

const savedUser =
JSON.parse(localStorage.getItem("user"));



if(!savedUser){

    alert("Account not found. Please signup first.");

    return;

}




// Check email

if(email !== savedUser.email){


    alert("Email is not registered.");

    return;

}




// Check password match

if(newPassword !== confirmPassword){


    alert("Passwords do not match.");

    return;

}




// Password rules

const passwordPattern =
/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%]).{8,}$/;



if(!passwordPattern.test(newPassword)){


alert(
"Password must contain 8 characters, uppercase, lowercase, number and special character."
);


return;


}




// Update password

savedUser.password = newPassword;



localStorage.setItem(
"user",
JSON.stringify(savedUser)
);



alert("Password reset successful! Please login.");

window.location.href="login.html";


});


}
/* ==========================================
   ADD TO CART
========================================== */


const cartButtons = document.querySelectorAll(".cart-btn");



cartButtons.forEach(button => {



button.addEventListener("click",function(){



    if(!checkLogin()){


        alert("Please login to add items to cart");

        window.location.href="login.html";

        return;


    }



    const productCard =
    button.closest(".product-card");



    const product={


        name:
        productCard.querySelector("h3")
        .textContent.trim(),


        price:
        productCard.querySelector(".price")
        .textContent.trim(),


        image:
        productCard.querySelector("img").src,


        quantity:1


    };



    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];



    const existing =
    cart.find(item=>item.name===product.name);



    if(existing){


        existing.quantity++;


    }

    else{


        cart.push(product);


    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    alert(product.name+" added to cart!");



});


});






/* ==========================================
   DISPLAY CART
========================================== */


const cartContainer =
document.getElementById("cartContainer");


const cartTotal =
document.getElementById("cartTotal");



if(cartContainer){



let cart =
JSON.parse(localStorage.getItem("cart")) || [];



displayCart();




function displayCart(){



cartContainer.innerHTML="";


let total=0;



if(cart.length===0){


cartContainer.innerHTML=
"<h2>Your Cart is Empty</h2>";


if(cartTotal)

cartTotal.textContent="Total: ₹0";


return;


}




cart.forEach((product,index)=>{


const price =
Number(product.price.replace(/[₹,]/g,""));



const subtotal =
price * product.quantity;



total += subtotal;



cartContainer.innerHTML += `


<div class="cart-item">


<img src="${product.image}">



<div class="cart-details">


<h3>${product.name}</h3>


<p class="price">
${product.price}
</p>



<div class="quantity-controls">


<button onclick="decreaseQuantity(${index})">
-
</button>


<span>${product.quantity}</span>


<button onclick="increaseQuantity(${index})">
+
</button>


</div>



<p>
Subtotal:
₹${subtotal.toLocaleString()}
</p>



<button class="remove-btn"
onclick="removeItem(${index})">


<img src="../assets/images/delete.png">


</button>



</div>


</div>


`;



});



if(cartTotal)

cartTotal.textContent=
`Total: ₹${total.toLocaleString()}`;



}




window.increaseQuantity=function(index){


cart[index].quantity++;


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


displayCart();


};





window.decreaseQuantity=function(index){


if(cart[index].quantity>1){


cart[index].quantity--;


}

else{


cart.splice(index,1);


}



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



displayCart();


};





window.removeItem=function(index){


cart.splice(index,1);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



displayCart();



};



}







/* ==========================================
   ADD TO WISHLIST
========================================== */


const wishlistButtons =
document.querySelectorAll(".wishlist-btn");



wishlistButtons.forEach(button=>{



const productCard =
button.closest(".product-card");



const product={


name:
productCard.querySelector("h3")
.textContent.trim(),


price:
productCard.querySelector(".price")
.textContent.trim(),


image:
productCard.querySelector("img").src


};




button.addEventListener("click",()=>{



if(!checkLogin()){


alert("Please login to add items to wishlist");


window.location.href="login.html";


return;


}




let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];



const exists =
wishlist.some(item=>item.name===product.name);



if(!exists){


wishlist.push(product);


}
else{


wishlist =
wishlist.filter(
item=>item.name!==product.name
);


}



localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);



updateWishlistIcon(button,product.name);



});



updateWishlistIcon(button,product.name);



});





function updateWishlistIcon(button,name){



let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];



const img =
button.querySelector("img");



const exists =
wishlist.some(item=>item.name===name);



if(exists){


img.src="../assets/images/heart-filled.png";


}

else{


img.src="../assets/images/wishlist.png";


}


}
/* ==========================================
   DISPLAY WISHLIST PAGE
========================================== */


const wishlistContainer =
document.getElementById("wishlistContainer");



if(wishlistContainer){



displayWishlist();



function displayWishlist(){



let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];



wishlistContainer.innerHTML="";



if(wishlist.length===0){


wishlistContainer.innerHTML=
"<h2>Your Wishlist is Empty</h2>";


return;


}





wishlist.forEach((product,index)=>{



wishlistContainer.innerHTML += `


<div class="cart-item">


<img src="${product.image}">



<div class="cart-details">


<h3>${product.name}</h3>


<p class="price">
${product.price}
</p>



<div class="product-buttons">



<button class="cart-btn"
onclick="moveToCart(${index})">


<img src="../assets/images/cart.png">


</button>




<button class="remove-btn"
onclick="removeWishlistItem(${index})">


<img src="../assets/images/delete.png">


</button>



</div>



</div>


</div>



`;



});



}



}





/* ==========================================
   REMOVE FROM WISHLIST
========================================== */


window.removeWishlistItem=function(index){



let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];



wishlist.splice(index,1);



localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);



displayWishlist();



};







/* ==========================================
   MOVE WISHLIST ITEM TO CART
========================================== */


window.moveToCart=function(index){



if(!checkLogin()){


alert("Please login first");


window.location.href="login.html";


return;


}




let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];



let cart =
JSON.parse(localStorage.getItem("cart")) || [];



const product =
wishlist[index];



const existing =
cart.find(
item=>item.name===product.name
);



if(existing){


existing.quantity++;


}

else{


product.quantity=1;

cart.push(product);


}




localStorage.setItem(

"cart",

JSON.stringify(cart)

);



wishlist.splice(index,1);



localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);



displayWishlist();



alert("Moved to Cart!");



};









/* ==========================================
   PROFILE PAGE
========================================== */


const saveProfileBtn =
document.getElementById("saveProfileBtn");



const logoutBtn =
document.getElementById("logoutBtn");



const profileName =
document.getElementById("profileName");


const profileEmail =
document.getElementById("profileEmail");


const profilePhone =
document.getElementById("profilePhone");


const profileAddress =
document.getElementById("profileAddress");


const profileCity =
document.getElementById("profileCity");


const profilePincode =
document.getElementById("profilePincode");





if(saveProfileBtn){



const profile =
JSON.parse(localStorage.getItem("profile"));



const loggedUser =
JSON.parse(localStorage.getItem("loggedInUser"));



const data =
profile || loggedUser;



if(data){


profileName.value=data.name || "";

profileEmail.value=data.email || "";

profilePhone.value=data.phone || "";

profileAddress.value=data.address || "";

profileCity.value=data.city || "";

profilePincode.value=data.pincode || "";


}




saveProfileBtn.addEventListener("click",()=>{



const profileData={



name:profileName.value.trim(),


email:profileEmail.value.trim(),


phone:profilePhone.value.trim(),


address:profileAddress.value.trim(),


city:profileCity.value.trim(),


pincode:profilePincode.value.trim()



};




if(
!profileData.name ||
!profileData.email ||
!profileData.phone ||
!profileData.address ||
!profileData.city ||
!profileData.pincode
){


alert("Please fill all profile details");


return;


}




localStorage.setItem(

"profile",

JSON.stringify(profileData)

);



alert("Profile Saved Successfully!");



});



}








/* ==========================================
   LOGOUT
========================================== */


if(logoutBtn){



logoutBtn.addEventListener("click",()=>{



const confirmLogout =
confirm(
"Are you sure you want to logout?"
);



if(confirmLogout){



localStorage.removeItem(
"loggedInUser"
);



localStorage.removeItem(
"profile"
);



// keep cart and wishlist
// as requested



alert("Logged out successfully!");



window.location.href="index.html";



}



});



}
/* ==========================================
   CHECKOUT PAGE
========================================== */


const checkoutItems =
document.getElementById("checkoutItems");


const checkoutTotal =
document.getElementById("checkoutTotal");


const placeOrderBtn =
document.getElementById("placeOrderBtn");



if(checkoutItems){



let cart =
JSON.parse(localStorage.getItem("cart")) || [];



displayCheckout();




function displayCheckout(){



checkoutItems.innerHTML="";


let total=0;



if(cart.length===0){



checkoutItems.innerHTML=
"<h2>Your Cart is Empty</h2>";



checkoutTotal.textContent=
"Total Amount: ₹0";


return;


}





cart.forEach(product=>{



const price =
Number(product.price.replace(/[₹,]/g,""));



const subtotal =
price * product.quantity;



total += subtotal;



checkoutItems.innerHTML += `


<div class="checkout-product">


<img src="${product.image}">


<div>


<h3>${product.name}</h3>


<p>
Quantity: ${product.quantity}
</p>


<p>
Price: ${product.price}
</p>


<p>
Subtotal:
₹${subtotal.toLocaleString()}
</p>


</div>


</div>


`;



});



checkoutTotal.textContent=
`Total Amount: ₹${total.toLocaleString()}`;


}




/* AUTO FILL PROFILE DETAILS */


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




const profile =
JSON.parse(localStorage.getItem("profile"));



if(profile && fullName){


fullName.value=profile.name || "";

mobile.value=profile.phone || "";

address.value=profile.address || "";

city.value=profile.city || "";

pincode.value=profile.pincode || "";


}






/* PLACE ORDER */


if(placeOrderBtn){



placeOrderBtn.addEventListener("click",()=>{



if(cart.length===0){


alert("Your cart is empty");


return;


}




const payment =
document.querySelector(
'input[name="payment"]:checked'
);





if(
!fullName.value ||
!mobile.value ||
!address.value ||
!city.value ||
!pincode.value
){


alert("Please fill delivery details");


return;


}





if(!payment){


alert("Please select payment method");


return;


}




let total =
cart.reduce((sum,item)=>{


const price =
Number(item.price.replace(/[₹,]/g,""));


return sum+
(price*item.quantity);


},0);






const order={



customer:{


fullName:fullName.value,

mobile:mobile.value,

address:address.value,

city:city.value,

pincode:pincode.value


},



payment:payment.value,



items:cart,



total:total,



date:new Date().toLocaleString(),



status:"Processing"



};





let orders =
JSON.parse(localStorage.getItem("orders")) || [];



orders.push(order);



localStorage.setItem(

"orders",

JSON.stringify(orders)

);





localStorage.removeItem("cart");



alert("Order Placed Successfully!");



window.location.href=
"order-success.html";



});



}



}








/* ==========================================
   ORDERS PAGE
========================================== */


const ordersContainer =
document.getElementById("ordersContainer");



if(ordersContainer){



let orders =
JSON.parse(localStorage.getItem("orders")) || [];



ordersContainer.innerHTML="";



if(orders.length===0){



ordersContainer.innerHTML=`

<h2>No Orders Found</h2>

<p>
Start shopping to see your orders
</p>

`;



}

else{



orders.forEach((order,index)=>{



const product =
order.items[0];



ordersContainer.innerHTML += `


<div class="order-card">


<h2>
Order #${index+1}
</h2>



<img 
src="${product.image}"
class="order-image">



<p>
Total:
₹${order.total.toLocaleString()}
</p>



<p>
Status:
${order.status}
</p>



<button onclick="viewOrder(${index})">

View Details

</button>



</div>



`;



});



}



}





window.viewOrder=function(index){



localStorage.setItem(

"selectedOrder",

index

);



window.location.href=
"order-details.html";


};








/* ==========================================
   ORDER DETAILS PAGE
========================================== */


const orderDetailsContainer =
document.getElementById("orderDetailsContainer");



if(orderDetailsContainer){



let orders =
JSON.parse(localStorage.getItem("orders")) || [];



let selected =
localStorage.getItem("selectedOrder");



const order =
orders[selected];



if(!order){



orderDetailsContainer.innerHTML=
"<h2>Order Not Found</h2>";



}

else{



let products="";



order.items.forEach(product=>{



products += `


<div class="order-product">


<img src="${product.image}">


<div>


<h3>
${product.name}
</h3>


<p>
Price:
${product.price}
</p>


<p>
Quantity:
${product.quantity}
</p>



</div>


</div>



`;



});





orderDetailsContainer.innerHTML=`



<div class="order-card">


<h2>
Order #${Number(selected)+1}
</h2>



<h3>
Products
</h3>



${products}



<hr>



<h3>
Customer Details
</h3>



<p>
Name:
${order.customer.fullName}
</p>



<p>
Phone:
${order.customer.mobile}
</p>



<p>
Address:
${order.customer.address},
${order.customer.city}
</p>



<p>
Payment:
${order.payment}
</p>



<h2>
Total:
₹${order.total.toLocaleString()}
</h2>



<p>
Status:
${order.status}
</p>



</div>



`;



}



}