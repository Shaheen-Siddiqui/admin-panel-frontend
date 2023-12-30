import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ProductContextProvider } from "./hook/productContext.jsx";
import { AuthContextProveder } from "./hook/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProveder>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </AuthContextProveder>
    </BrowserRouter>
  </React.StrictMode>
);
