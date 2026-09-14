/* ==========================================
   KANYA HOUSE OF SAREES
   PROFILE.JS
========================================== */


/* ==========================================
   GET ELEMENTS
========================================== */

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

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


/* ==========================================
   LOAD PROFILE
   DJANGO + MYSQL
========================================== */

async function loadProfile() {

    const token =
        localStorage.getItem("authToken");

    /* Check login token */
    if (!token) {

        alert("Please login again.");

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
           DISPLAY PROFILE DATA
        ========================================== */

        profileName.value =
            data.name || "";

        profileEmail.value =
            data.email || "";

        profilePhone.value =
            data.phone || "";

        profileAddress.value =
            data.address || "";

        profileCity.value =
            data.city || "";

        profilePincode.value =
            data.pincode || "";
    }


    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        alert(
            "Unable to connect to server. Please make sure Django is running."
        );
    }
}


/* ==========================================
   SAVE PROFILE
   DJANGO + MYSQL
========================================== */

async function saveProfile() {

    const token =
        localStorage.getItem("authToken");


    /* Check login token */

    if (!token) {

        alert("Please login again.");

        window.location.href =
            "login.html";

        return;
    }


    /* Get form values */

    const name =
        profileName.value.trim();

    const email =
        profileEmail.value.trim();

    const phone =
        profilePhone.value.trim();

    const address =
        profileAddress.value.trim();

    const city =
        profileCity.value.trim();

    const pincode =
        profilePincode.value.trim();


    /* ==========================================
       VALIDATION
    ========================================== */

    if (!name) {

        alert(
            "Please enter your name."
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (!/^[0-9]{6}$/.test(pincode)) {

        alert(
            "Please enter a valid 6-digit pincode."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/accounts/update-profile/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Token " + token
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        address: address,

                        city: city,

                        pincode: pincode
                    })
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
                "Unable to update profile."
            );

            return;
        }


        /* ==========================================
           SUCCESS
        ========================================== */

        alert(
            "Profile Updated Successfully!"
        );
    }


    catch (error) {

        console.error(
            "Profile update error:",
            error
        );

        alert(
            "Unable to connect to server. Please make sure Django is running."
        );
    }
}


/* ==========================================
   SAVE BUTTON
========================================== */

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        saveProfile
    );
}


/* ==========================================
   LOAD PROFILE WHEN PAGE OPENS
========================================== */

if (saveProfileBtn) {

    loadProfile();
}


/* ==========================================
   LOGOUT
========================================== */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Are you sure you want to logout?"
                )
            ) {

                localStorage.removeItem(
                    "loggedInUser"
                );

                localStorage.removeItem(
                    "profile"
                );

                localStorage.removeItem(
                    "authToken"
                );


                alert(
                    "Logged out successfully!"
                );


                window.location.href =
                    "login.html";
            }
        }
    );
}