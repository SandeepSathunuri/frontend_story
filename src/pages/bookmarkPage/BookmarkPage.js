import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkPage.css'; 
import API_BASE_URL from '../../config/config'; 

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [expanded, setExpanded] = useState(false); 
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch bookmarks when component mounts
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBookmarks`); 
      setBookmarks(response.data.bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSeeMore = () => {
    setExpanded(true); // Expand to show all bookmarks
  };

  // Get the first 4 bookmarks or all if expanded
  const visibleBookmarks = expanded ? bookmarks : bookmarks.slice(0, 4);

  return (
    <div className="bookmark-page">
      <h2>Your Bookmarks</h2>
      
      {loading ? ( // Render loading state
        <div className="loading-indicator">Loading bookmarks...</div>
      ) : (
        <>
          <div className="bookmark-grid">
            {visibleBookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-card">
                <img
                  src={bookmark.imageUrl}
                  alt={bookmark.heading}
                  className="bookmark-image"
                />
                <h3>{bookmark.heading}</h3>
                <p>{bookmark.description}</p>
              </div>
            ))}
          </div>

          {/* Show 'See More' button only if there are more than 4 bookmarks */}
          {!expanded && bookmarks.length > 4 && (
            <div className="see-more-container">
              <button className="see-more-btn" onClick={handleSeeMore}>
                See More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarkPage;
