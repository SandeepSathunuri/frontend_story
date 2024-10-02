import React, { useEffect, useState } from 'react';
import './StoryGrid.css';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShare, FaBookmark, FaRegBookmark, FaHeart, FaRegHeart, FaTimes } from "react-icons/fa"; // Added FaTimes for close button
import API_BASE_URL from '../../config/config';
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import LoginModal from './login';

const StoryGrid = (props) => {
  const [story, setStory] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userIDfromRedux = useSelector((state) => state.user.userId);
  let { storyID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultImageTime = 5000;
  const defaultVideoTime = 15000;

  if (!storyID) {
    storyID = props?.storyID;
  }

  const fetchStoryDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStorybyId?storyID=${storyID}`);
      if (response.status === 200) {
        setStory(response?.data);
        setSlides(response?.data?.slides || []);
        setIsModalOpen(true); // Open modal when story data is fetched
      } else {
        console.log('Error fetching story details');
      }
    } catch (error) {
      console.log('Error fetching story:', error);
    }
  };

  useEffect(() => {
    if (storyID) {
      fetchStoryDetails();
    }
  }, [storyID, props]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const slideIndex = queryParams.get('slideIndex');

    if (slideIndex && !isNaN(slideIndex)) {
      const index = parseInt(slideIndex, 10);
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index);
      }
    }
  }, [location.search, slides]);

  useEffect(() => {
    if (slides.length === 0) return;

    setProgress(0);
    const currentSlideData = slides[currentSlide];
    const isVideo = currentSlideData.imageOrVideoURl.endsWith('.mp4');
    const slideDuration = isVideo ? defaultVideoTime : defaultImageTime;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          handleNextSlide();
          return 0;
        }
        return prev + (100 / (slideDuration / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentSlide, slides]);

  const handleNextSlide = () => {
    if (slides.length > 0 && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentSlide === slides.length - 1) {
      handleClose();
    }
  };

  const handlePrevSlide = () => {
    if (slides.length > 0 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false); 
    if (props?.storyID != null) {
      props?.onClose();
    }
    navigate('/');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/story/${storyID}?slideIndex=${currentSlide}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Story URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy URL:', err);
      });
  };

  const toggleBookmark = () => {
    if (!userIDfromRedux) {
      setIsLoginOpen(true);
      return;
    }
    setIsBookmarked(prev => !prev);
  };

  const toggleLike = async () => {
    if (!userIDfromRedux) {
      setIsLoginOpen(true);
      return;
    }

    try {
      if (isLiked) {
        const response = await axios.post(`${API_BASE_URL}/unlikeSlides`, { slideID: slides[currentSlide].slideID, userID: userIDfromRedux });
        if (response.status === 200) {
          setIsLiked(false);
          setLikeCount((prevCount) => prevCount - 1);
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/likeslides`, { slideID: slides[currentSlide].slideID, userID: userIDfromRedux });
        if (response.status === 200) {
          setIsLiked(true);
          setLikeCount((prevCount) => prevCount + 1);
        }
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
  };

  const closeLoginModal = () => setIsLoginOpen(false);

  if (slides.length === 0) {
    return <div>Loading slides...</div>;
  }

  return (
    <>
      <div className="story-modal-overlay">
        <ToastContainer />
        <div className="story-modal-content">
          <div className="story-modal-header">
            <button className="story_close-btn" onClick={handleClose}>
              <FaTimes size={30}/>
            </button>
            <div className="progress-indicator">
              {slides.map((_, index) => (
                <div key={index} className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${index === currentSlide ? progress : currentSlide > index ? 100 : 0}%`
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="story-slides">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.5 }}
                className="story-slide-item"
              >
                {slides[currentSlide] && (
                  <>
                    {slides[currentSlide].imageOrVideoURl.endsWith('.mp4') ? (
                      <video
                        src={slides[currentSlide].imageOrVideoURl}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={slides[currentSlide].imageOrVideoURl}
                        alt={`Slide ${currentSlide + 1}`}
                      />
                    )}
                    <h2>{slides[currentSlide].heading}</h2>
                    <p>{slides[currentSlide].description}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="story-actions">
            <button className="like-btn" onClick={toggleLike} style={{ color: isLiked ? 'red' : 'white' }}>
              {isLiked ? <FaHeart /> : <FaRegHeart />}</button>
              <span  class="like-count">{likeCount}</span>
            
            <button className="bookmark-btn" onClick={toggleBookmark}>
              {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            <button className="share-btn" onClick={handleShare}>
              <FaShare />
            </button>
          </div>
        </div>

        <div className="story-arrows">
          <button className="arrow_left-arrow" onClick={handlePrevSlide} disabled={currentSlide === 0}>
            &lt;
          </button>
          <button className="arrow_right-arrow" onClick={handleNextSlide} disabled={currentSlide === slides.length - 1}>
            &gt;
          </button>
        </div>
      </div>
      {isLoginOpen && <LoginModal closeModal={closeLoginModal} />}
    </>
  );
};

export default StoryGrid;
