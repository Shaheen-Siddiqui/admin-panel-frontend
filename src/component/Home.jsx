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
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [currentSmallSize, setCurrentSmallSize] = useState('');
  const [color, setColor] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    rating: "",
    category: "",
    imageUrl: null, // For file upload
    smallSize: [],
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

  const handleAddSize = () => {
    if (currentSmallSize) {
      setFormData({
        ...formData,
        smallSize: [...smallSize, currentSmallSize],
      });
      setCurrentSmallSize(''); // Reset the input field
    }
  };

  const handleRemoveSize = (index) => {
    const newSizes = smallSize.filter((_, i) => i !== index);
    setFormData({ ...formData, smallSize: newSizes });
  };

  const handleAddColor = () => {
    if (color) {
      setFormData({
        ...formData,
        availableColor: [...availableColor, color],
      });
      setColor(""); // Reset the input field
    }
  };

  const handleRemoveColor = (index) => {
    const newColor = availableColor.filter((_, i) => i !== index);
    setFormData({ ...formData, availableColor: newColor });
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
        "https://admin-panel-j1q2.onrender.com/product/add",
        formData,
        config
      );
      setFormData({
        title: "",
        price: "",
        rating: "",
        category: "",
        imageUrl: null,
        smallSize: [],
        availableColor: [],
        crouselImage: [], // For multiple file uploads
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
    const uploadedImageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", files[i]);
      cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      cloudinaryFormData.append("folder", "Abdullah-Store");

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: cloudinaryFormData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImageUrls.push(data.url); // Collect the URL
            
            setMultiFileLoading(false);
        } else {
          toast.error("Image upload failed for " + files[i].name);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image: " + files[i].name);
      }
    }

    setFormData({
      ...formData,
      crouselImage: uploadedImageUrls, // Set the array of URLs
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.crouselImage.filter((_, i) => i !== index);
    setFormData({ ...formData, crouselImage: newImages });
  };


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

                <option value="preteens Waistcoat">Kids Waistcoat</option>
                <option value="preteens Kurta">Kids Kurta</option>
                <option value="Waistcoat">young's Waistcoat</option>
                <option value="young adult's Kurta">young adult's Kurta</option>
                <option value="Gifts for beloved">Gifts </option>
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
              required
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
                required
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
                required
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

          <div>
            <label>
              Selected Images: &nbsp;
              <strong
                onClick={() => setShowImagePreview(!showImagePreview)}
                className="pointer"
              >
                {showImagePreview ? <span>📂</span> : <span>📁</span>}
              </strong>
            </label>
            {showImagePreview && (
              <div className="image-preview-container">
                {formData.crouselImage.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Preview ${index}`} />
                    <strong
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label="Remove image"
                    >
                      ×
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="smallSize">Sizes:</label>
            <div className="size-input-container">
              <input
                type="number"
                value={currentSmallSize}
                onChange={(e) => setCurrentSmallSize(e.target.value)}
                placeholder="Enter size"
                min="0"
              />
              <button type="button" onClick={handleAddSize}>
                Add Size
              </button>
            </div>

            <ul className="size-list">
              {smallSize.map((size, index) => (
                <li key={index} className="size-item">
                  <span className="size-number">{size}</span>
                  <button
                    className="remove-size-button"
                    onClick={() => handleRemoveSize(index)}
                    aria-label="Remove size"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ADD COLOR */}
          <div>
            <label htmlFor="smallSize">Available Colors:</label>
            <div className="size-input-container">
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Enter color"
                min="0"
              />
              <button type="button" onClick={handleAddColor}>
                Add Color
              </button>
            </div>

            <ul className="size-list">
              {availableColor.map((size, index) => (
                <li key={index} className="size-item">
                  <span className="size-number">{size}</span>
                  <button
                    className="remove-size-button"
                    onClick={() => handleRemoveColor(index)}
                    aria-label="Remove size"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button type="submit" className="submit-bnn">
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Home;
