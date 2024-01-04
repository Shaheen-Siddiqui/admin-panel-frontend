import React, { useContext, useEffect } from "react";
import "./model.css";
import axios from "axios";
import ProductContext from "../../hook/productContext";
import { toast } from "react-toastify";

const Editmodel = ({ setIsModelOpen }) => {
  const { editFormData, SetEditFormData, products, setProducts } =
    useContext(ProductContext);
  const {
    qty,
    _id,
    __v,
    smallSize,
    availableColor,
    crouselImage,
    ...formDataWithoutId
  } = editFormData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    const encodedToken = JSON.parse(localStorage.getItem("admin-token"));
    e.preventDefault();
    try {
      await axios.post(
        `https://admin-panel-j1q2.onrender.com/product/edit/${_id}`,
        formDataWithoutId,
        {
          headers: {
            Authorization: encodedToken,
          },
        }
      );
      const getEditedDataField = products.map((dbItem) =>
        dbItem._id === _id ? editFormData : dbItem
      );

      setProducts(getEditedDataField);
      setIsModelOpen(false); // Closed the modal upon successful edit
    } catch (error) {
      console.error("Error editing product:", error);
      toast.error("internal server error");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setIsModelOpen(false)}>
          &times;
        </span>
        <h2>Edit Product</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            value={editFormData.title}
            onChange={handleInputChange}
            type="text"
            id="title"
            name="title"
          />

          <label htmlFor="price">Price:</label>
          <input
            value={editFormData.price}
            onChange={handleInputChange}
            type="number"
            id="price"
            name="price"
          />

          <label htmlFor="rating">Rating:</label>
          <input
            value={editFormData.rating}
            onChange={handleInputChange}
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
          />

          <label htmlFor="category">Category:</label>
          <input
            value={editFormData.category}
            onChange={handleInputChange}
            type="text"
            id="category"
            name="category"
          />

          <label htmlFor="imageUrl">Image URL:</label>
          <input
            value={editFormData.imageUrl}
            onChange={handleInputChange}
            type="text"
            id="imageUrl"
            name="imageUrl"
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Editmodel;
