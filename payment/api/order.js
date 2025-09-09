// api/order.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Missing Razorpay environment variables" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 10000, // ₹100
      currency: "INR",
      receipt: "RCP_" + Date.now(),
    });

    return res.status(200).json({
      amount: order.amount,
      order_id: order.id,
      key: RAZORPAY_KEY_ID, // safe to expose
    });
  } catch (err) {
    console.error("Razorpay error:", err);
    return res.status(500).json({ error: err.message || "Order creation failed" });
  }
}
