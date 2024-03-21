import React from 'react';
import Review from '../Review';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '../Landing';
import MyPage from '../MyPage';
import Search from '../Search';

function App () {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/Review" element={<Review />} />
          <Route path="/Search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;