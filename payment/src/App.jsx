// App.jsx
import React from "react";
import { useRazorpay } from "react-razorpay";

const AMOUNT = 10000;

const App = () => {
  const { error, isLoading, Razorpay } = useRazorpay();

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

      const apiBase = (
        import.meta.env.VITE_API_URL || "http://localhost:8000"
      ).replace(/\/$/, "");
      console.log("Fetching from:", `${apiBase}/order`);
      const response = await fetch(`${apiBase}/order`);
      if (!response.ok) {
        throw new Error("Failed to create order: " + response.statusText);
      }
      const data = await response.json();
      const orderId = data.id || data.order_id;

      const options = {
        amount: AMOUNT,
        order_id: orderId,
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RFStPkOWxpjAKq",
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        prefill: {
          name: "Razor Singh",
          email: "rajorsingh@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const RazorpayConstructor = Razorpay || window.Razorpay;
      if (!RazorpayConstructor || typeof RazorpayConstructor !== "function") {
        alert(
          "Razorpay checkout didn't load correctly. Check console for details."
        );
        console.error("Razorpay constructor not available", {
          Razorpay,
          windowRazorpay: window.Razorpay,
        });
        return;
      }

      const razor = new RazorpayConstructor(options);

      razor.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      razor.open();
    } catch (err) {
      console.error("payNow error:", err);
      alert("Payment failed: " + (err.message || err));
    }
  };

  return (
    <div className="page">
      <div className="card" role="region" aria-label="Payment card">
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
          <div className="amount-box">
            <div className="amount-left">
              <div className="label">Amount</div>
              <div className="amount">₹100.00</div>
            </div>
            <div className="amount-right">
              <div className="label">Currency</div>
              <div className="currency">INR</div>
            </div>
          </div>

          <div className="actions">
            <button
              className={`btn btn-primary${isLoading ? " disabled" : ""}`}
              onClick={payNow}
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? "Loading…" : "Pay ₹100"}
            </button>
          </div>

          <div className="status-row">
            <div className="status-left">
              {error ? (
                <span className="status-error">Error loading checkout</span>
              ) : (
                <span className="status-ok">
                  {isLoading ? "Checkout loading…" : "Ready to pay"}
                </span>
              )}
            </div>
            <div className="status-right">Secure · Fast · Reliable</div>
          </div>
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
