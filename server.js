const express = require("express");
const app = express();
const db = require("./database.js");

// Middleware to parse incoming JSON payloads
app.use(express.json());

const PORT = 8000;

// Task 3: Email address validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email.trim());
}

// Task 3: Credit card number validation function (exactly 12 digits)
function isValidCreditCard(cardNumber) {
    const cardRegex = /^\d{12}$/;
    return typeof cardNumber === 'string' || typeof cardNumber === 'number'
        ? cardRegex.test(String(cardNumber).trim())
        : false;
}

// Task 2: POST API endpoint to register customer
app.post("/api/customer", (req, res) => {
    const {
        customerName,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expiryDate,
        expirytDate, // Handles potential typo from request body
        cvv,
        timeStamp
    } = req.body;

    const cardExpDate = expiryDate || expirytDate || "";

    // Validate required Customer Name
    if (!customerName || typeof customerName !== 'string' || customerName.trim() === "") {
        return res.status(400).json({
            error: "Bad Request: customerName is required."
        });
    }

    // Task 3: Email Validation
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            error: "Bad Request: Invalid email address format."
        });
    }

    // Task 3: Credit Card Validation (12 digits)
    if (!cardNumber || !isValidCreditCard(cardNumber)) {
        return res.status(400).json({
            error: "Bad Request: Credit card number must be exactly 12 digits."
        });
    }

    const sql = `
        INSERT INTO customer (
            customerName, address, email, dateOfBirth, gender, age,
            cardHolderName, cardNumber, expiryDate, cvv, timeStamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        customerName.trim(),
        address || "",
        email.trim(),
        dateOfBirth || "",
        gender || "",
        age || null,
        cardHolderName || "",
        String(cardNumber).trim(),
        cardExpDate,
        cvv || "",
        timeStamp || new Date().toISOString()
    ];

    db.run(sql, params, function (err) {
        if (err) {
            // Task 2: Error handling - 400 Bad Request
            return res.status(400).json({
                error: `Bad Request: ${err.message}`
            });
        }

        // Task 2: Success response with HTTP status 201 Created and generated customerId
        return res.status(201).json({
            message: "Customer registered successfully",
            data: {
                id: this.lastID,
                customerName: customerName.trim(),
                address,
                email: email.trim(),
                dateOfBirth,
                gender,
                age,
                cardHolderName,
                cardNumber: String(cardNumber).trim(),
                expiryDate: cardExpDate,
                cvv,
                timeStamp
            },
            customerId: this.lastID
        });
    });
});

// Default route
app.get("/", (req, res) => {
    res.json({ message: "Products & Customer Registration API is running" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
