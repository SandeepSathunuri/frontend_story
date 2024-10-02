import React, { useState } from "react";
import "./loginStyle.css";
import { useDispatch } from 'react-redux';
import { setUserId } from '../../redux/userslice.js';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from '../../config/config.js';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginModal = ({ isOpen, onClose, toggleMenu }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const loginSchema = Yup.object({
    username: Yup.string().required("Enter Username "),
    password: Yup.string()
      .required("Enter Your Password")
      .min(6, "Password must be at least 6 characters long")
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, values);
        const { token } = response.data;

        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;

        localStorage.setItem('user', userId);
        localStorage.setItem('username', values.username);
        dispatch(setUserId(userId));
        
        onClose();
        toggleMenu();
      } catch (err) {
        console.error('Login failed', err);
        toast.error("Incorrect Username or Password");
      }
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="background">
       <ToastContainer />
      <div className="box">
        <button className="close-icon" onClick={onClose}>
          <img src='../../../images/cross.jpg'/>
        </button>
        <h2 className="heading">Login</h2>
        <form onSubmit={formik.handleSubmit} method="POST">
          <div className="form-field">
            <label>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              className="input-field"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.username && formik.touched.username && (
              <div className="error-text">{formik.errors.username}</div>
          )}
          <div className="form-field">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input-field"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span 
                className="password-icon" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👓" : "👁️"}
              </span>
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
              <div className="error-text">{formik.errors.password}</div>
          )}
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
