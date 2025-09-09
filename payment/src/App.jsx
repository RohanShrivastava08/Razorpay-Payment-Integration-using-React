import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";

const App = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [amount, setAmount] = useState(100); // default 100 INR
  const [paymentResult, setPaymentResult] = useState(null);

  const payNow = async () => {
    try {
      if (isLoading) {
        alert("Razorpay is still loading. Please wait.");
        return;
      }
      if (error) {
        alert("Error loading Razorpay: " + error);
        return;
      }

      // Convert INR to paise for Razorpay
      const amountInPaise = amount * 100;

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });
      if (!response.ok) throw new Error("Failed to create order: " + response.statusText);

      const data = await response.json();
      const orderId = data.id || data.order_id;

      const options = {
        amount: data.amount,
        order_id: orderId,
        key: data.key,
        currency: "INR",
        name: "Test Company",
        description: "Custom Transaction",
        handler: function (response) {
          setPaymentResult({
            status: "success",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: "Razor Singh",
          email: "rajorsingh@example.com",
          contact: "9876543210",
        },
        theme: { color: "#4f46e5" },
      };

      const RazorpayConstructor = Razorpay || window.Razorpay;
      if (!RazorpayConstructor || typeof RazorpayConstructor !== "function") {
        console.error("Razorpay checkout not available");
        return;
      }

      const razor = new RazorpayConstructor(options);

      razor.on("payment.failed", function (response) {
        setPaymentResult({
          status: "failed",
          error: response.error.description,
          code: response.error.code,
        });
      });

      razor.open();
    } catch (err) {
      setPaymentResult({ status: "failed", error: err.message });
    }
  };

  // Reset to allow new payment
  const resetPayment = () => {
    setPaymentResult(null);
    setAmount(100);
  };

  return (
    <div className="page">
      <div className="card">
        <header className="card-header">
          <div className="brand">
            <div className="brand-logo">TC</div>
            <div className="brand-text">
              <h1 className="brand-title">Test Company</h1>
              <p className="brand-sub">Secure payments powered by Razorpay</p>
            </div>
          </div>
        </header>

        <section className="card-body">
          {/* Payment result box */}
          {paymentResult ? (
            <div className={`result-box ${paymentResult.status}`}>
              {paymentResult.status === "success" ? (
                <>
                  <h3>✅ Payment Successful</h3>
                  <table>
                    <tbody>
                      <tr><td>Payment ID</td><td>{paymentResult.paymentId}</td></tr>
                      <tr><td>Order ID</td><td>{paymentResult.orderId}</td></tr>
                      <tr><td>Signature</td><td>{paymentResult.signature}</td></tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <h3>❌ Payment Failed</h3>
                  <p>{paymentResult.error}</p>
                  {paymentResult.code && <p>Error Code: {paymentResult.code}</p>}
                </>
              )}
              <div className="actions">
                <button className="btn btn-primary" onClick={resetPayment}>
                  Back
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Amount input */}
              <div className="amount-box">
                <div className="amount-left">
                  <div className="label">Enter Amount</div>
                  <input
                    type="number"
                    className="amount-input"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="amount-right">
                  <div className="label">Currency</div>
                  <div className="currency">INR</div>
                </div>
              </div>

              {/* Pay button */}
              <div className="actions">
                <button
                  className={`btn btn-primary${isLoading ? " disabled" : ""}`}
                  onClick={payNow}
                  disabled={isLoading || !amount}
                >
                  {isLoading ? "Loading…" : `Pay ₹${amount}`}
                </button>
              </div>
            </>
          )}
        </section>

        <footer className="card-footer">
          <div className="small">
            By proceeding you agree to the terms and privacy policy.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
