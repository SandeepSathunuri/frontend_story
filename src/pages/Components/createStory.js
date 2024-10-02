import React, { useState, useCallback, useMemo } from 'react';
import './CreateStory.css';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config/config';
import axios from 'axios';

const CreateStory = ({ isOpen, onClose, onStoryCreated }) => {
  const userIDfromREdux = useSelector((state) => state.user.userId);
  const [slides, setSlides] = useState([
    { heading: '', description: '', image: '', category: '' },
    { heading: '', description: '', image: '', category: '' },
    { heading: '', description: '', image: '', category: '' },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoDurationError, setVideoDurationError] = useState(null);
  const maxSlides = 6;

  const handleInputChange = useCallback(
    (e, index, field) => {
      const updatedSlides = [...slides];
      updatedSlides[index][field] = e.target.value;
      setSlides(updatedSlides);

      if (field === 'image' && isVideoURL(e.target.value)) {
        validateVideoDuration(e.target.value);
      } else {
        setVideoDurationError(null); 
      }
    },
    [slides]
  );

  

  const isVideoURL = (url) => {
    // Simple check based on file extensions (you can refine this if needed)
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const validateVideoDuration = (videoURL) => {
    const video = document.createElement('video');
    video.src = videoURL;

    video.onloadedmetadata = () => {
      if (video.duration > 15) {
        setVideoDurationError('Video duration exceeds 15 seconds.');
      } else {
        setVideoDurationError(null);
      }
    };

    video.onerror = () => {
      setVideoDurationError('Invalid video URL or unable to load video.');
    };
  };

  const handleAddSlide = useCallback(() => {
    if (slides.length < maxSlides) {
      let slideLength = slides?.length;
      setSlides([...slides, { heading: '', description: '', image: '', category: '' }]);
      setCurrentSlide(slideLength);
    }
  }, [slides]);

  const handleRemoveSlide = useCallback((index) => {
    setCurrentSlide(0);
    const updatedSlides = slides.filter((_, idx) => idx !== index);
    setSlides(updatedSlides);
  }, [slides]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const allFieldsFilled = useMemo(() => {
    return slides.every((slide) => slide.heading && slide.description && slide.image && slide.category);
  }, [slides]);

  const handleSubmit = useCallback(async () => {
    if (allFieldsFilled) {
      try {
        const storyData = {
          userID: userIDfromREdux || null, // Allow null userID for unauthenticated users
          slides: slides.map((slide) => ({
            heading: slide.heading,
            description: slide.description,
            imageOrVideoURL: slide.image, // Adjusting property name to match the API requirement
            category: slide.category,
          })),
        };
        const response = await axios.post(`${API_BASE_URL}/createStoryWithSlide`, storyData);
        console.log('Story created successfully:', response.data.data);

        if (typeof onStoryCreated === 'function') {
          onStoryCreated(); // Call the function only if it's passed
        }
        onClose(); // Close the modal after success
      } catch (error) {
        console.error('Error creating story:', error);
        alert('An error occurred while creating the story. Please try again.');
      }
    } else {
      alert('Please fill all fields before submitting.');
    }
  }, [allFieldsFilled, slides, onClose, userIDfromREdux, onStoryCreated]);

  if (!isOpen) return null;

  return (
    <div className="container">
      <div className="subContainer">
        <div className="slide-navigation1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`slide-box ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              Slide {idx + 1}
              {slides.length > 3 && idx === slides.length - 1 && (
                <span className="cross2" onClick={() => handleRemoveSlide(idx)}>
                  <img src='../../../images/cross.jpg' alt="remove" />
                </span>
              )}
            </button>
          ))}
          {slides.length < maxSlides && (
            <button className="add-btn" onClick={handleAddSlide}>{'Add + '}</button>
          )}
        </div>
        <div className="slides">
          {currentSlide < slides.length && (
            <>
              <div className="forms">
                <label>Heading:</label>
                <input
                  type="text"
                  value={slides[currentSlide]?.heading || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'heading')}
                  placeholder="Your heading"
                  required
                />
              </div>
              <div className="forms">
                <label>Description:</label>
                <textarea
                  value={slides[currentSlide]?.description || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'description')}
                  placeholder="Story description"
                  required
                />
              </div>
              <div className="forms">
                <label>Image/Video URL:</label>
                <input
                  type="text"
                  value={slides[currentSlide]?.image || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'image')}
                  placeholder="Add image/Video URL"
                  required
                />
                {videoDurationError && <div className="error">{videoDurationError}</div>} {/* Displaying error */}
              </div>
              <div className="forms">
                <label>Category:</label>
                <select
                  value={slides[currentSlide]?.category || ''}
                  onChange={(e) => handleInputChange(e, currentSlide, 'category')}
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Music">Music</option>
                  <option value="Movies">Movies</option>
                  <option value="World">World</option>
                  <option value="India">India</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="navigation-buttons">
          <button className="prev-btn" onClick={handlePrevious} disabled={currentSlide === 0}>Previous</button>
          <button className="next-btn" onClick={handleNext} disabled={currentSlide === slides.length - 1}>Next</button>
        </div>

        <div className="post-section">
          <button className="post-btn" onClick={handleSubmit}>Post</button>
        </div>

        <span className="close1" onClick={onClose}>
          <img src='../../../images/cross.jpg' alt="close" />
        </span>
      </div>
    </div>
  );
};

export default CreateStory;
