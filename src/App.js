import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/Homepage';
import StoryGrid from './pages/Components/storyGrid.js'; 
import Navbar from './pages/navbar/navbar'; 
import BookmarkPage from './pages/bookmarkPage/BookmarkPage';

function App() {
  return (
    <div className="App">
      <Navbar/>
      
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyID" element={<StoryGrid />} />
        <Route path="/bookmarks" element={<BookmarkPage />} /> 
      </Routes>
    </div>
  );
}


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
