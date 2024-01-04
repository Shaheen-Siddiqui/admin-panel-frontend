import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import './Login.css';
import { authContext } from '../../hook/authContext';

const Login = () => {
  const navigate = useNavigate();
  const { token, setAuthDispatch } = useContext(authContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

    try {
      const response = await axios.post(
        'https://admin-panel-j1q2.onrender.com/login',
        formData
      );

      localStorage.setItem('admin-token', JSON.stringify(response.data.token));

      setAuthDispatch({ type: 'USER_LOGIN', payload: response.data.token });
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid email or password');
      } else {
        console.error('Error during login:', error);
        toast.error('Internal server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className='login-button' type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
