
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyAPCjVtvp7QiXqPVJDF6Ynw8kq6SMEUcHQ",
    authDomain: "investment-5c3f8.firebaseapp.com",
    projectId: "investment-5c3f8",
    storageBucket: "investment-5c3f8.firebasestorage.app",
    messagingSenderId: "420795229421",
    appId: "1:420795229421:web:904b481b1a896307da58e4",
    measurementId: "G-E3FB79ZK4Y"
};

// START FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// FORM ELEMENTS
const form = document.getElementById("form");
const firstnameInput = document.getElementById("firstname-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const errorMessage = document.getElementById("error-message");

// DISPLAY ERROR MESSAGE
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

// HANDLE FIREBASE ERRORS
function displayFirebaseError(error, isSignup = false) {
    console.error(isSignup ? "Signup error:" : "Login error:", error);

    switch (error.code) {
        case "auth/network-request-failed":
            showError(
                "Could not connect to Firebase. Check your internet connection and try again."
            );
            break;

        case "auth/email-already-in-use":
            showError("This email is already registered. Please log in.");
            break;

        case "auth/invalid-email":
            showError("Please enter a valid email address.");
            break;

        case "auth/weak-password":
            showError("Your password must be at least 6 characters.");
            break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            showError("Incorrect email or password.");
            break;

        case "auth/too-many-requests":
            showError("Too many attempts. Please wait a while and try again.");
            break;

        case "auth/operation-not-allowed":
            showError("This sign-in method is not enabled in Firebase.");
            break;

        default:
            showError(
                (isSignup ? "Signup failed: " : "Login failed: ") +
                (error.message || "Please try again.")
            );
    }
}

// CHECK FORM EXISTS
if (!form) {
    console.error("Form not found. Check that your HTML has id='form'.");
} else if (!emailInput || !passwordInput || !errorMessage) {
    console.error(
        "A required login form element is missing. Check your HTML element IDs."
    );
} else {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        showError("");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // SIGNUP PAGE
        if (firstnameInput) {
            if (!repeatPasswordInput) {
                showError("The repeat-password field is missing from the signup page.");
                return;
            }

            const firstname = firstnameInput.value.trim();
            const repeatPassword = repeatPasswordInput.value;
            const errors = getSignupFormErrors(
                firstname,
                email,
                password,
                repeatPassword
            );

            if (errors.length > 0) {
                showError(errors.join(". "));
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                await updateProfile(userCredential.user, {
                    displayName: firstname
                });

                alert("Account created successfully!");
                window.location.href = "login.html";

            } catch (error) {
                displayFirebaseError(error, true);
            }

        } else {
            // LOGIN PAGE
            const errors = getLoginFormErrors(email, password);

            if (errors.length > 0) {
                showError(errors.join(". "));
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);

                // REDIRECT AFTER SUCCESSFUL LOGIN
                window.location.href = "contact.html";

            } catch (error) {
                displayFirebaseError(error);
            }
        }
    });
}

// SIGNUP VALIDATION
function getSignupFormErrors(firstname, email, password, repeatPassword) {
    const errors = [];

    if (!firstname) {
        errors.push("First name is required.");
        firstnameInput?.parentElement?.classList.add("incorrect");
    }

    if (!email) {
        errors.push("Email is required.");
        emailInput?.parentElement?.classList.add("incorrect");
    }

    if (!password) {
        errors.push("Password is required.");
        passwordInput?.parentElement?.classList.add("incorrect");
    } else if (password.length < 6) {
        errors.push("Password must have at least 6 characters.");
        passwordInput?.parentElement?.classList.add("incorrect");
    }

    if (!repeatPassword) {
        errors.push("Please repeat your password.");
        repeatPasswordInput?.parentElement?.classList.add("incorrect");
    } else if (password !== repeatPassword) {
        errors.push("Passwords do not match.");
        passwordInput?.parentElement?.classList.add("incorrect");
        repeatPasswordInput?.parentElement?.classList.add("incorrect");
    }

    return errors;
}

// LOGIN VALIDATION
function getLoginFormErrors(email, password) {
    const errors = [];

    if (!email) {
        errors.push("Email is required.");
        emailInput?.parentElement?.classList.add("incorrect");
    }

    if (!password) {
        errors.push("Password is required.");
        passwordInput?.parentElement?.classList.add("incorrect");
    }

    return errors;
}

// CLEAR FIELD ERRORS WHEN USER TYPES
[
    firstnameInput,
    emailInput,
    passwordInput,
    repeatPasswordInput
].filter(Boolean).forEach((input) => {
    input.addEventListener("input", () => {
        input.parentElement?.classList.remove("incorrect");
        showError("");
    });
});
