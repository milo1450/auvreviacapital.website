import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAPCjVtvp7QiXqPVJDF6Ynw8kq6SMEUcHQ" ,
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
const firstname_input = document.getElementById("firstname-input");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const repeat_password_input = document.getElementById("repeat-password-input");
const error_message = document.getElementById("error-message");


// FORM SUBMISSION
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let errors = [];

    // SIGNUP PAGE
    if (firstname_input) {

        errors = getSignupFormErrors(
            firstname_input.value.trim(),
            email_input.value.trim(),
            password_input.value,
            repeat_password_input.value
        );

        if (errors.length > 0) {
            error_message.innerText = errors.join(". ");
            return;
        }

        const firstname = firstname_input.value.trim();
        const email = email_input.value.trim();
        const password = password_input.value;

        try {

            // CREATE FIREBASE ACCOUNT
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // SAVE FIRST NAME TO THE USER'S FIREBASE PROFILE
            await updateProfile(userCredential.user, {
                displayName: firstname
            });

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            if (error.code === "auth/email-already-in-use") {
                error_message.innerText = "This email is already registered.";
            } 
            else if (error.code === "auth/invalid-email") {
                error_message.innerText = "Please enter a valid email address.";
            } 
            else if (error.code === "auth/weak-password") {
                error_message.innerText = "Password is too weak.";
            } 
            else {
                error_message.innerText = "Signup failed. Please try again.";
            }
        }

    }

    // LOGIN PAGE
    else {

        errors = getLoginFormErrors(
            email_input.value.trim(),
            password_input.value
        );

        if (errors.length > 0) {
            error_message.innerText = errors.join(". ");
            return;
        }

        const email = email_input.value.trim();
        const password = password_input.value;

        try {

            // LOGIN WITH FIREBASE
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Login successful!");

        } catch (error) {

            console.error(error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {
                error_message.innerText = "Incorrect email or password.";
            } 
            else {
                error_message.innerText = "Login failed. Please try again.";
            }
        }
    }
});


// SIGNUP VALIDATION
function getSignupFormErrors(firstname, email, password, repeatPassword) {

    let errors = [];

    if (firstname === "") {
        errors.push("Firstname is required");
        firstname_input.parentElement.classList.add("incorrect");
    }

    if (email === "") {
        errors.push("Email is required");
        email_input.parentElement.classList.add("incorrect");
    }

    if (password === "") {
        errors.push("Password is required");
        password_input.parentElement.classList.add("incorrect");
    }

    if (password.length < 8) {
        errors.push("Password must have at least 8 characters");
        password_input.parentElement.classList.add("incorrect");
    }

    if (password !== repeatPassword) {
        errors.push("Password does not match repeated password");
        password_input.parentElement.classList.add("incorrect");
        repeat_password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}


// LOGIN VALIDATION
function getLoginFormErrors(email, password) {

    let errors = [];

    if (email === "") {
        errors.push("Email is required");
        email_input.parentElement.classList.add("incorrect");
    }

    if (password === "") {
        errors.push("Password is required");
        password_input.parentElement.classList.add("incorrect");
    }

    return errors;
}


// REMOVE ERRORS WHEN USER TYPES
const allInputs = [
    firstname_input,
    email_input,
    password_input,
    repeat_password_input
].filter(input => input !== null);


allInputs.forEach(input => {

    input.addEventListener("input", () => {

        if (input.parentElement.classList.contains("incorrect")) {
            input.parentElement.classList.remove("incorrect");
        }

        error_message.innerText = "";
    });

});