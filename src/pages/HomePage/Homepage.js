import React, { useState, useEffect } from 'react';
import './HomePage.css';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import StoryGrid from '../Components/storyGrid.js';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [storyData, setStoryData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const categoryList = [
    { name: 'All', image: '../../../images/education.png' },
    { name: 'Music', image: '../../../images/education.png' },
    { name: 'Movies', image: '../../../images/anime.jpg' },
    { name: 'World', image: '../../../images/Travel.png' },
    { name: 'India', image: '../../../images/anime.jpg' },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStoryData(selectedCategory);
  }, [selectedCategory]);

  const fetchStoryData = async (category, limit = 4) => {
    setLoading(true);
    try {
      console.log("Loading started...");
      const response = await axios.get(`${API_BASE_URL}/getStoryByCategory?category=${category}&limit=${limit}`);

      if (response.status === 200) {
        const newData = response.data.data;
        setStoryData(newData);
        console.log("Data saved");
      } else {
        console.log('Error fetching data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching story data:', error);
    } finally {
      setLoading(false);
      console.log('Loading stopped...');
    }
  };

  const handleStoryClick = (storyId) => {
    setSelectedStoryId(storyId);
    setSelectedSlideIndex(0);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setExpandedCategories({});
    fetchStoryData(category, 4);
  };

  const handleSeeMore = (category) => {
    fetchStoryData(category, 100);
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: true
    }));
  };

  const handleStoryCreated = () => {
    fetchStoryData();
  };

  return (
    <div className="homepage">
      <ToastContainer />
      <div className="categories">
        {categoryList.map((category, index) => (
          <div
            key={index}
            className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div
              className="card-background"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        storyData.map((categoryData, index) => (
          <div key={index} className="category-section">
            <h2 className="stories-title">Top Stories in {categoryData.category}</h2>
            {Array.isArray(categoryData.stories) && categoryData.stories.length === 0 ? (
              <div className="no-stories-container">
                <p>No stories found</p>
              </div>
            ) : (
              <>
                <div className="stories-grid">
                  {Array.isArray(categoryData.stories) && categoryData.stories.map((story, idx) => (
                    <div key={idx} className="story-card" onClick={() => handleStoryClick(story.storyID)}>
                      {story?.slides[0].imageOrVideoURl.endsWith('.mp4') ? (
                        <video
                          src={story?.slides[0].imageOrVideoURl}
                          autoPlay
                          muted
                          playsInline
                          className="story-media"
                        />
                      ) : (
                        <img
                          src={story?.slides[0].imageOrVideoURl}
                          alt={`Slide ${0 + 1}`}
                          className="story-media"
                        />
                      )}
                      <h1>{story?.slides[0].heading}</h1>
                      <p>{story?.slides[0].description}</p>
                    </div>
                  ))}
                </div>

                {categoryData.hasMore && !expandedCategories[categoryData.category] && (
                  <div className="see-more-container">
                    <button className="see-more-btn" onClick={() => handleSeeMore(categoryData.category)}>
                      See More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}

      {selectedStoryId && (
        <div className="story-modal-container">
          <StoryGrid
            storyID={selectedStoryId}
            slideIndex={selectedSlideIndex}
            onClose={() => setSelectedStoryId(null)}
            onStoryCreated={handleStoryCreated}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
