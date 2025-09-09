require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

app.use(cors());

app.get("/order", async (req, res) => {
  try {
    const data = await razorpay.orders.create({
      amount: 10000,
      currency: "INR",
      receipt: "RCP_ID" + Date.now(),
    });
    res.json({
      amount: data.amount,
      order_id: data.id,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
