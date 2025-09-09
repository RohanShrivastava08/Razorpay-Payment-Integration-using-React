const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("❌ Missing Razorpay env vars");
    return res.status(500).json({ error: "Missing Razorpay env vars (set in Vercel)" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 10000,
      currency: "INR",
      receipt: "RCP_" + Date.now(),
    });

    return res.status(200).json({
      amount: order.amount,
      order_id: order.id,
      key: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // Log full error to Vercel logs
    console.error("❌ Razorpay order error:", err);

    // Return a readable debug response (temporarily) so you can see details in browser
    const message = err && err.error && err.error.description
      ? err.error.description
      : (err && err.message) || "Order creation failed";

    return res.status(500).json({
      error: message,
      code: err && err.error && err.error.code,
      raw: err && typeof err === "object" ? JSON.stringify(err) : String(err)
    });
  }
};