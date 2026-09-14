/* ==========================================
   KANYA HOUSE OF SAREES
   AUTH.JS
========================================== */


/* ==========================================
   SIGNUP SYSTEM
========================================== */

const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const phone =
            document.getElementById("signupPhone").value.trim();

        /* ==========================================
           VALIDATE PHONE
        ========================================== */

        if (!/^[0-9]{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        /* ==========================================
           VALIDATE PASSWORD
        ========================================== */

        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;
        }


        if (!name || !email || !password) {

            alert("Please fill all required fields");

            return;
        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/accounts/signup/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.error ||
                    "Signup failed"
                );

                return;
            }


            alert("Signup Successful!");


            window.location.href =
                "login.html";

        }


        catch (error) {

            console.error(
                "Signup error:",
                error
            );


            alert(
                "Unable to connect to server. Please make sure Django is running."
            );

        }

    });

}


/* ==========================================
   LOGIN SYSTEM
========================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        if (!email || !password) {

            alert(
                "Please enter email and password"
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_BASE_URL}/api/accounts/login/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.error ||
                    "Invalid Email or Password"
                );

                return;
            }


            /* ==========================================
               SAVE LOGGED-IN USER
            ========================================== */

            const loggedInUser = {

                id: data.user_id,

                username: data.username,

                email: data.email

            };


            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(loggedInUser)
            );


            /* ==========================================
               SAVE DJANGO AUTH TOKEN
            ========================================== */

            localStorage.setItem(
                "authToken",
                data.token
            );


            alert("Login Successful!");


            window.location.href =
                "index.html";

        }


        catch (error) {

            console.error(
                "Login error:",
                error
            );


            alert(
                "Unable to connect to server. Please make sure Django is running."
            );

        }

    });

}


/* ==========================================
   FORGOT PASSWORD
   DJANGO API VERSION
========================================== */

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");


if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "forgotEmail"
                ).value.trim();


            const message =
                document.getElementById(
                    "forgotMessage"
                );


            message.textContent =
                "Sending reset link...";


            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/accounts/forgot-password/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email
                        })
                    }
                );


                const data =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        data.message;


                    forgotPasswordForm.reset();

                }

                else {

                    message.textContent =
                        data.error ||
                        "Something went wrong.";

                }

            }


            catch (error) {

                console.error(
                    "Forgot password error:",
                    error
                );


                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

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

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                localStorage.removeItem(
                    "loggedInUser"
                );



                localStorage.removeItem(
                    "authToken"
                );


                alert(
                    "Logged out successfully!"
                );


                window.location.href =
                    "index.html";

            }

        }
    );

}


/* ==========================================
   RESET PASSWORD
   DJANGO API VERSION
========================================== */

const resetPasswordForm =
    document.getElementById("resetPasswordForm");


if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmNewPassword"
                ).value;


            const message =
                document.getElementById(
                    "resetMessage"
                );


            /* ==========================================
               GET UID AND TOKEN FROM URL
            ========================================== */

            const urlParams =
                new URLSearchParams(
                    window.location.search
                );


            const uid =
                urlParams.get("uid");


            const token =
                urlParams.get("token");


            /* ==========================================
               CHECK RESET LINK
            ========================================== */

            if (!uid || !token) {

                message.textContent =
                    "Invalid or missing password reset link.";

                return;

            }


            /* ==========================================
               VALIDATE PASSWORD
            ========================================== */

            if (newPassword.length < 8) {

                message.textContent =
                    "Password must be at least 8 characters.";

                return;

            }


            if (newPassword !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;

            }


            message.textContent =
                "Resetting password...";


            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/accounts/reset-password/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            uid: uid,
                            token: token,
                            new_password: newPassword
                        })
                    }
                );


                const data =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        data.message;


                    resetPasswordForm.reset();


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 2000);

                }

                else {

                    message.textContent =
                        data.error ||
                        "Password reset failed.";

                }

            }


            catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}