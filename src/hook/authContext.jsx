import { createContext, useReducer } from "react";
import { authReducer } from "./authReducer";

export const authContext = createContext(null);

export const AuthContextProveder = ({ children }) => {
  const [{token,user}, setAuthDispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("admin-token") || "",
  });


  return (
    <authContext.Provider value={{ setAuthDispatch,token,user }}>
      {children}
    </authContext.Provider>
  );
};
