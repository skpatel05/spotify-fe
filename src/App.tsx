import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist';

import './global.css';
import PrivateRoute from './components/PrivateRoute';
import { SearchProvider } from './components/searchContext';
const App: React.FC = () => {
  return (
    <SearchProvider> 
    <Router>
      <Header />
      <div style={{ minHeight: '80vh', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/createplaylist" element={<PrivateRoute element={<CreatePlaylist />} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </SearchProvider>
  );
};

export default App;
