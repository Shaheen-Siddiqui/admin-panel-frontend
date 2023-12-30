import React, { createContext, useState } from "react";

export const ProductContext = createContext(null);

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

 

  const [editFormData, SetEditFormData] = useState({
    title: "",
    price: "",
    rating: "",
    category: "",
    imageUrl: null, // For file edit
  });

  return (
    <ProductContext.Provider
      value={{  products, setProducts, editFormData, SetEditFormData }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
