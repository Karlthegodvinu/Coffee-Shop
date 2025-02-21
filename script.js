// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Array to hold the user's order
let order = [];

// Function to add coffee to the order
function addToOrder(coffeeName) {
    order.push(coffeeName);
    displayOrder();
}

// Function to display the order
function displayOrder() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = ""; // Clear existing list
    order.forEach((coffee, index) => {
        const li = document.createElement("li");
        li.textContent = coffee;
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => {
            order.splice(index, 1);
            displayOrder();
        };
        li.appendChild(removeButton);
        orderList.appendChild(li);
    });
}

// Function to place the order and save it to Firebase
function placeOrder() {
    if (order.length === 0) {
        alert("Your order is empty. Please select a coffee.");
    } else {
        const customerName = prompt("Please enter your name:"); // Get customer's name
        if (customerName) {
            // Generate random token and counter numbers
            const tokenNumber = Math.floor(Math.random() * 1000) + 1;
            const counterNumber = Math.floor(Math.random() * 10) + 1;

            // Prepare the order object
            const orderDetails = {
                customerName: customerName,
                orderItems: order,
                tokenNumber: tokenNumber,
                counterNumber: counterNumber,
                createdAt: new Date().toISOString(),
            };

            // Save the order to Firebase
            push(ref(db, "orders/"), orderDetails)
                .then(() => {
                    alert(
                        `Thank you for your order, ${customerName}!\nToken: ${tokenNumber}\nCounter: ${counterNumber}`
                    );
                    order = []; // Clear the order after placing
                    displayOrder();
                })
                .catch((error) => {
                    console.error("Error saving order:", error);
                    alert("Failed to place the order. Please try again.");
                });
        }
    }
}
