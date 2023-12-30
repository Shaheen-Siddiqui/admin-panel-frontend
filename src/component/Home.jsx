import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ProductContext } from '../hook/productContext';
import { toast } from 'react-toastify';
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_URL,
} from '../utils/uploadImageCloudinaty';

import './Home.css';
import { authContext } from '../hook/authContext';

const Home = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    rating: '',
    category: '',
    imageUrl: null, // For file upload
  });
  const { title, price, rating, category, imageUrl } = formData;

  const handleFileChange = async (event) => {
    setLoading(true); // Set loading to true when starting upload

    const file = event.target.files[0];
    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...formData,
          imageUrl: data.url,
        });
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // Set loading to false when upload is complete
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const encodedToken = JSON.parse(localStorage.getItem('admin-token'));
    try {
      const config = {
        headers: {
          Authorization: encodedToken,
        },
      };
      await axios.post(
        'https://admin-panel-j1q2.onrender.com/product/add',
        formData,
        config
      );
      setFormData({
        title: '',
        price: '',
        rating: '',
        category: '',
        imageUrl: null,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Please log in');
      } else {
        toast.error('One fiels is missing');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="form-section">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="imageUrl">
              {loading ? 'Uploading...' : 'Upload Image'}
            </label>
            <div className="file-input">
              <input
                onChange={handleFileChange}
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
            <label htmlFor="title">Title:</label>
            <input
              onChange={handleChange}
              value={title}
              type="text"
              id="title"
              name="title"
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
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

          <button type="submit">{loading ? 'uploading...' : 'Submit'}</button>
        </form>
      </section>
    </>
  );
};

export default Home;
