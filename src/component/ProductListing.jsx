import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";

import "./ProductListing.css";
import Editmodel from "./model/model";
import { ProductContext } from "../hook/productContext";

const ProductListing = () => {
  const { products, setProducts, SetEditFormData } = useContext(ProductContext);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://admin-panel-j1q2.onrender.com/product"
        );
        setProducts(response.data.map((item) => ({ ...item, qty: 1 })));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.status === 404) {
          toast.error("No Product Found:");
        } else {
          toast.error("Error fetching products:");
        }
      }
    };

    fetchProducts();
  }, []);

  const deleteProductById = async (id) => {
    const encodedToken = JSON.parse(localStorage.getItem("admin-token"));
    const config = {
      headers: {
        Authorization: encodedToken,
      },
    };

    try {
      await axios.delete(
        `https://admin-panel-j1q2.onrender.com/product/remove/${id}`,
        config
      );
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("internal server error");
    }
  };

  const editIconFunction = (productToEdit) => {
    setIsModelOpen(true); // Open the edit modal;
    SetEditFormData(productToEdit);
  };

  return (
    <>
      {isLoading ? (
        <div className="color-ring-wrapper-case">

          <ColorRing
            visible={true}
            height="90"
            width="90"
            ariaLabel="color-ring-loading"
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <section id="products-section">
          <div className="products-preview">
            {products.map((product, index) => {
              return (
                <div className="product-card" key={index}>
                  <div className="edit-remove-icons">
                    <span
                      className="edit-icon"
                      onClick={() => editIconFunction(product)}
                    >
                      ✏️
                    </span>
                    <span
                      className="remove-icon"
                      onClick={() => deleteProductById(product._id)}
                    >
                      ❌
                    </span>
                  </div>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="product-details">
                    <p>Name: {product.title}</p>
                    <p>Price: ${product.price}</p>
                    <p>Rating: {product.rating}/5</p>
                    <p>Category: {product.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isModelOpen && <Editmodel setIsModelOpen={setIsModelOpen} />}
    </>
  );
};

export default ProductListing;
