const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay environment variables");
    return res.status(500).json({ error: "Server config error" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 10000, // ₹100 in paise
      currency: "INR",
      receipt: "RCP_" + Date.now(),
    });

    return res.status(200).json({
      amount: order.amount,
      order_id: order.id,
      key: RAZORPAY_KEY_ID, // safe to expose (public key)
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return res.status(500).json({ error: "Order creation failed" });
  }
};
