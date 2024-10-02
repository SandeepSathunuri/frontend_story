import React, { useState } from "react";
import "./Navbar.css";
import RegisterModal from "../Components/registration";
import LoginModal from "../Components/login";
import CreateStory from "../Components/createStory.js";
import { useSelector, useDispatch } from "react-redux";
import { clearUserId } from "../../redux/userslice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  const username=localStorage.getItem('username')
  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);
  const openCreateStoryModal = () => setIsCreateStoryOpen(true);
  const closeCreateStoryModal = () => setIsCreateStoryOpen(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(clearUserId());
    setIsMenuOpen(false); 
    localStorage.clear();
  };

  const handleUserProfileClick = () => {
    const usernameBox = document.querySelector(".username-box");
    usernameBox.classList.toggle("show");
  };

  return (
    <nav className="navbar">
      {/* Hamburger Menu for mobile view */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span>&#9776;</span> {/* Hamburger icon */}
      </div>

      {/* Conditionally render the navbar options */}
      <div className={`navbar-options ${isMenuOpen ? "active" : ""}`}>
        {userIDfromREdux ? (
          <>
            <div className="user-profile" id="p1">
              <img
                src="../../../images/profile.jpg"
                alt="User Profile"
                onError={(e) => (e.target.src = "default-profile-pic.png")} // Fallback image
              />
              <span className="profile-info">
                {username} 
              </span>
            </div>

            <button className="button-bookmarks">
              <Link to="/bookmarks">Bookmarks</Link>
            </button>

            <button className="button-add-story" onClick={openCreateStoryModal}>
              Add story
            </button>

            <div className="profile-dropdown" id="logoutHide">
              <button className="button-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="user-profile" id="p2">
              <img
                src="../../../images/profile.jpg"
                alt="User Profile"
                onError={(e) => (e.target.src = "../../../images/profile.jpg")} // Fallback image
                onClick={handleUserProfileClick}
              />
              <div className="profile-info">
                {username} {/* Display the dynamic username */}
              </div>
            </div>

            <div className="username-box">
              <p>{username}</p> 
              <div className="profile-dropdown">
                <button className="button-logout logout2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`menu-icon-cross ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
            >
              <span>&#10006;</span> {/* Hamburger icon */}
            </div>

            <button className="button-register" onClick={openRegisterModal}>
              Register Now
            </button>
            <button className="button-signin" onClick={openLoginModal}>
              Sign In
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {isRegisterOpen && (
        <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} />
      )}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLoginModal}
          toggleMenu={toggleMenu}
        />
      )
      }
      {isCreateStoryOpen && (
        <CreateStory
          isOpen={isCreateStoryOpen}
          onClose={closeCreateStoryModal}
        />
      )}
    </nav>
  );
};

export default Navbar;
