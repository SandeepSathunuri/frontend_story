import React, { useState } from "react";
import "./loginStyle.css";
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import API_BASE_URL from '../../config/config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const registrationSchema = Yup.object({
    username: Yup.string().required("Enter User Name"),
    password: Yup.string()
      .required("Enter Your Password")
      .min(6, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "At least one Upper case character needed")
      .matches(/[a-z]/, "At least one lower case character needed")
      .matches(/[0-9]/, "One numeric value needed")
      .matches(
        /[~!@#$%^&*()_+{}\[\]:;"'<>,.?/|\\-`]/,
        "One special Character needed"
      ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${API_BASE_URL}/signup`, values, {
          headers: {
            // Include any headers if necessary
          },
        });
        toast.success(res.data.message);
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Registration failed");
      }
    },
    
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
        <h2 className="heading">Register</h2>
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
