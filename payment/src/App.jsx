// src/App.jsx
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";

const AMOUNT = 10000; // ₹100 in paise

const App = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [result, setResult] = useState(null); // { status: 'success'|'failed', ... }

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

      const response = await fetch("/api/order");
      if (!response.ok) {
        throw new Error("Failed to create order: " + response.statusText);
      }
      const data = await response.json();
      const orderId = data.id || data.order_id;

      const options = {
        amount: data.amount || AMOUNT,
        order_id: orderId,
        key: data.key, // value sent from backend
        currency: "INR",
        name: "Test Company",
        description: "Test Transaction",
        handler: function (response) {
          // no alerts — store result and show Back button
          setResult({
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
        theme: {
          color: "#4f46e5",
        },
      };

      const RazorpayConstructor = Razorpay || window.Razorpay;
      if (!RazorpayConstructor || typeof RazorpayConstructor !== "function") {
        alert("Razorpay checkout didn't load correctly. Check console for details.");
        console.error("Razorpay constructor not available", { Razorpay, windowRazorpay: window.Razorpay });
        return;
      }

      const razor = new RazorpayConstructor(options);

      razor.on("payment.failed", function (response) {
        setResult({
          status: "failed",
          error: response?.error?.description || "Payment failed",
          code: response?.error?.code,
        });
      });

      razor.open();
    } catch (err) {
      console.error("payNow error:", err);
      setResult({ status: "failed", error: err.message || String(err) });
    }
  };

  const goBack = () => {
    setResult(null);
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
          {/* Result box — shown after payment attempt */}
          {result && (
            <div className={`result-box ${result.status === "success" ? "success" : "failed"}`}>
              {result.status === "success" ? (
                <>
                  <h3>✅ Payment Successful</h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>Payment ID</td>
                        <td>{result.paymentId}</td>
                      </tr>
                      <tr>
                        <td>Order ID</td>
                        <td>{result.orderId}</td>
                      </tr>
                      <tr>
                        <td>Signature</td>
                        <td>{result.signature}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <h3>❌ Payment Failed</h3>
                  <p>{result.error}</p>
                  {result.code && <p>Error Code: {result.code}</p>}
                </>
              )}

              <div style={{ marginTop: 14 }}>
                <button className="btn btn-primary" onClick={goBack}>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Payment card (only shown when no result) */}
          {!result && (
            <>
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
                    <span className="status-ok">{isLoading ? "Checkout loading…" : "Ready to pay"}</span>
                  )}
                </div>
                <div className="status-right">Secure · Fast · Reliable</div>
              </div>
            </>
          )}
        </section>

        <footer className="card-footer">
          <div className="small">By proceeding you agree to the terms and privacy policy.</div>
        </footer>
      </div>
    </div>
  );
};

export default App;
