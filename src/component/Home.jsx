import React, { useContext, useState } from "react";
import axios from "axios";
import { ProductContext } from "../hook/productContext";
import { toast } from "react-toastify";

import "./Home.css";
import { handleFileChange } from "../utils/helperFunctions";
import {
  CLOUDINARY_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "../utils/uploadImageCloudinaty";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [multiFileLoading, setMultiFileLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    rating: "",
    category: "",
    imageUrl: null, // For file upload
    smallSize: [],
    bigSize: [],
    availableColor: [],
    crouselImage: [], // For multiple file uploads
  });
  const {
    title,
    price,
    rating,
    category,
    imageUrl,
    smallSize,
    bigSize,
    availableColor,
    crouselImage,
  } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const encodedToken = JSON.parse(localStorage.getItem("admin-token"));
    try {
      const config = {
        headers: {
          Authorization: encodedToken,
        },
      };
      const res = await axios.post(
        "http://localhost:3005/product/add",
        formData,
        config
      );
      setFormData({
        title: "",
        price: "",
        rating: "",
        category: "",
        imageUrl: null,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Please log in");
      } else {
        toast.error("fiels are empty");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleMultipleFileChange = async (event) => {
    setMultiFileLoading(true);
    const files = event.target.files;
    const imagesArray = [];
    const cloudinaryFormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      imagesArray.push(files[i].name);
      cloudinaryFormData.append("file", files[i]);
      cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      cloudinaryFormData.append("folder", "Abdullah-Store");
    }

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: cloudinaryFormData,
      });

      
      if (response.ok) {
        const data = await response.json();

        setFormData({
          ...formData,
          // crouselImage: 
        });
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setMultiFileLoading(false);
    }
  };

  console.log(crouselImage, "--");

  return (
    <>
      <section id="form-section">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="price-rating-case">
            <div className="form-group">
              <label htmlFor="imageUrl">
                {loading ? "Uploading..." : "Upload Image"}
              </label>
              <div className="file-input">
                <input
                  onChange={(event) =>
                    handleFileChange(event, setLoading, setFormData, formData)
                  }
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  accept="image/*"
                />

                <label htmlFor="imageUrl" className="file-label">
                  Choose file
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                name="category"
                onChange={handleChange}
              >
                <option value="" disabled defaultValue>
                  Select category
                </option>

                <option value="preteens Waistcoat">preteens Waistcoat</option>
                <option value="preteens Kurta">preteens Kurta</option>
                <option value="Waistcoat">Waistcoat</option>
                <option value="young adult's Kurta">young adult's Kurta</option>
                <option value="Gifts for beloved">Gifts for beloved</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              onChange={handleChange}
              value={title}
              type="text"
              id="title"
              name="title"
            />
          </div>

          <div className="price-rating-case">
            <div className="input-group">
              <label htmlFor="price">Price:</label>
              <input
                onChange={handleChange}
                value={price}
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="input-group">
              <label htmlFor="rating">Rating:</label>
              <input
                onChange={handleChange}
                value={rating}
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                step="1"
              />
            </div>
          </div>

          <div className="image-upload-container">
            <label htmlFor="crouselImage" className="image-upload-label">
              {multiFileLoading ? "Uploading..." : "Upload Image"}
            </label>
            <div className="image-upload-input">
              <input
                onChange={handleMultipleFileChange}
                type="file"
                id="crouselImage"
                name="crouselImage"
                accept="image/*"
                className="image-upload-file"
                multiple
              />
              <label htmlFor="crouselImage" className="image-upload-choose">
                Choose Multiple
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Selected Images:</label>
            <ul>
              {/* {crouselImage.map((image, index) => (
                <li key={index}>{image}</li>
              ))} */}
            </ul>
          </div>

          <button type="submit">
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Home;
