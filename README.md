# 🔐 Full-Stack Authentication Web Application

A production-ready, secure full-stack authentication web application built with **React**, **Vite**, **Node.js**, **Express**, **JWT (JSON Web Tokens)**, and **MongoDB**.

---

## 🚀 Features

- **User Authentication**: Secure Sign Up and Login with password hashing using `bcryptjs`.
- **JWT Authorization**: Token-based authentication with expiration and protected routes.
- **Form Validation**: Strict client-side and server-side request validation using `Joi`.
- **Protected Data**: Authenticated `/product` and `/me` routes with token verification middleware.
- **Session Management**: Persistent session handling and route guards (`RefreshHandler` and `PrivateRoute`).
- **Production-Ready**: Configured for deployment on platforms like Render, Railway, Vercel, and Netlify.

---

## 📁 Project Structure

```text
Authentication-app/
├── .gitignore
├── README.md
├── BackEnd/
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   └── authMiddleWare.js
│   │   └── authValidation.js
│   ├── models/
│   │   └── userModel.js
│   └── routes/
│       ├── productRouter.js
│       └── userRoutes.js
└── FrontEnd/
    ├── .env.example
    ├── vercel.json
    ├── public/
    │   └── _redirects
    ├── src/
    │   ├── config.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── utils.jsx
    │   ├── refreshHandler.jsx
    │   └── Pages/
    │       ├── Home.jsx
    │       ├── Login.jsx
    │       └── SignUp.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Environment Configuration

### 1. BackEnd (`BackEnd/.env`)

Create a `.env` file inside `BackEnd/` (or copy from `BackEnd/.env.example`):

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

### 2. FrontEnd (`FrontEnd/.env`)

Create a `.env` file inside `FrontEnd/` (or copy from `FrontEnd/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 💻 Running Locally

### Backend:
```bash
cd BackEnd
npm install
npm run dev   # Runs with nodemon
# or
npm start     # Runs standard production node process
```

### Frontend:
```bash
cd FrontEnd
npm install
npm run dev
```

---

## ☁️ Deployment Guide

### Option A: Deploying the Backend (e.g. Render / Railway)

1. **Create a Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: `BackEnd`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in your hosting dashboard:
   - `PORT`: `8080` (or leave default assigned by provider)
   - `MONGO_URL`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (your deployed frontend URL)

### Option B: Deploying the Frontend (e.g. Vercel / Netlify)

1. **Import the project** into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Configure project settings:
   - **Root Directory**: `FrontEnd`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the Environment Variable in your Vercel/Netlify dashboard:
   - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com` (your deployed backend URL, without trailing slash)
4. Deploy! SPA routing rewrites are pre-configured via `vercel.json` and `_redirects`.