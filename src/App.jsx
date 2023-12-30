import { Route, Routes, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import Home from "./component/Home";
import ProductListing from "./component/ProductListing";
import Login from "./component/authentication/Login";
import { RequireAuth } from "./RequireAuth";

import "./app.css";
import { useContext } from "react";
import { authContext } from "./hook/authContext";

function App() {
  const { token, setAuthDispatch } = useContext(authContext);

  const userLogoutHandler = () => {
    setAuthDispatch({ type: "USER_LOGOUT" });
    localStorage.removeItem("admin-token");
    toast.info("logged out successfully", {
      autoClose: 2000,
      className: "toast-styling",
    });
  };
  return (
    <>
    

      <ToastContainer
        position="bottom-right"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <nav className="top-navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {token ? (
            <li onClick={userLogoutHandler}>logout</li>
          ) : (
            <li>
              <Link to="/login">login</Link>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAuth>
              <ProductListing />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
