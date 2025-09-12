# 💳 Razorpay Payment Gateway Integration – React + Vercel

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/a4c0f18a-ebde-4925-a8a2-69a8aeee7318" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/fba24fa8-b9e7-4947-9118-8b8256772790" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/eeadcf60-9ad4-4754-a93a-1ef5129cc608" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/b9e09cf4-569d-4b49-93e6-012da02af983" />

- A full-stack project that integrates Razorpay Checkout into a modern React frontend with a secure serverless backend on Vercel.


## 📋 Table of Contents
- Introduction
- Features
- Project Implementation Process
- File Structure
- Technology Stack
- Installation
- Usage
- Screenshots
- Contributing
- License
- Contact

## 📘 Introduction

- This project demonstrates a minimal yet powerful Razorpay integration with:

- A clean React payment UI 🎨

- Secure serverless backend on Vercel ☁️

- Environment variables for safe key handling 🔑

- Instead of alerts, users get success/failure result cards with transaction details for a professional experience.

### Flow:

- Frontend fetches an order from /api/order.

- Vercel serverless function creates a Razorpay order securely.

- Razorpay Checkout popup opens for payment.

- Payment status (success/failure) is displayed in a styled result box.

## ✨ Features

💻 React Frontend → Modern UI for payments

🔒 Razorpay Checkout → Secure & smooth payment flow

☁️ Serverless Backend → Built with Vercel Functions

🔑 Secure Env Handling → Keys hidden with environment variables

📊 Success / Failure UI → Styled result cards instead of alerts

🚀 Deployed on Vercel → Live, scalable, and easy to share

## 🛠 Project Implementation Process

#### 1. Frontend Flow
- User clicks Pay Now
- API call made to /api/order
- Razorpay Checkout initialized with backend order ID

#### 2. Backend Logic
- Serverless function (api/order.js) creates order using Razorpay SDK
- Responds with order ID + safe public key

#### 3. UI/UX Enhancements
- Styled payment card with amount & currency
- Success (green) and failure (red) result boxes
- Back button for retrying payments

## 📁 File Structure

```bash
razorpay-integration/
├── src/
│   ├── App.jsx               # Main React component (payment UI)
│   ├── index.css             # Styling for UI + result boxes
├── api/
│   └── order.js              # Vercel serverless backend function
├── public/                   # Static assets
├── .env.local                # (Frontend-only safe env vars, optional)
├── package.json              # Dependencies & scripts
└── README.md

```

## 💻 Technology Stack

Category	Tech Used

⚛️ Frontend	React + Vite

🎨 Styling	CSS (custom, minimal)

🔒 Payment Gateway	Razorpay Checkout

☁️ Backend	Vercel Serverless Functions

🔑 Security	Environment Variables

🚀 Deployment	Vercel


## 🛠 Installation

Follow these steps to set up and run the Techny project locally:

#### 1. Clone the repository

```bash
git clone https://github.com/YourUsername/razorpay-integration.git
cd razorpay-integration
```

#### 2. Install dependencies

```bash
npm install
# or
yarn install
```

#### 3. Set Up Environment Variables

- In Vercel Dashboard → Project → Settings → Environment Variables, add:

```bash
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

### 4. Run the app

```bash
npm run dev
```

## 🚀 Usage
- Open the app in your browser
- Click Pay ₹100
- Complete the Razorpay Checkout flow
- See transaction result displayed in a styled box
- Use Back button to retry


## 📸 Screenshots



## 🤝 Contributing
We welcome community contributions! Follow the steps below to contribute:

#### Fork the repository
- Create a new branch:
```bash
git checkout -b feature/YourFeature
```

- Commit your changes:
```bash
git commit -m 'Add your feature'
```

- Push to the branch:
```bash
git push origin feature/YourFeature
```

- Open a pull request with detailed explanations of your changes.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact
For any questions or suggestions, feel free to reach out:

- Email: rohansh0808@gmail.com
- GitHub: Rohansh0808
