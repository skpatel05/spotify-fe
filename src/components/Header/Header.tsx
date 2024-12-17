import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment,CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { getSearchResults } from '../../services/api'; 
import { useSearch } from '../searchContext';

const Header: React.FC = () => {
  const { setSearchResults } = useSearch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string>("");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/home");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


  //   event.preventDefault();
  //   if (!searchQuery.trim()) return; // Prevent search if query is empty

  //   if (!userId) {
  //     setError('User not authenticated');
  //     return;
  //   }

  //   setLoading(true);
  //   setError(""); // Reset error before starting the API call

  //   try {
  //     // Fetch search results from API
  //     const response = await getSearchResults(searchQuery, userId);

  //     if (response.status === 'success') {
  //       setSearchResults(response.data); // Set search results in the state
  //     } 
  //   } catch (error) {
  //     setError('An error occurred while fetching search results');
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getSearchResults(searchQuery, userId);
      console.log('Search Results:', response);
      if (response.status === 'success') {
        setSearchResults(response.data); 
        navigate("/home");
      } 
    } catch (error) {
      setError('An error occurred while fetching search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={goToHome}>
          Spotify App
        </Typography>

        {/* Render search bar if user is logged in */}
        {token && (
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <TextField
              variant="outlined"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="medium" // Medium size for the search bar
              style={{ backgroundColor: 'white',  }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        )}
        {/* Display loading spinner while waiting for API response */}
        {loading && <CircularProgress size={24} style={{ marginRight: '20px' }} />}

        {/* Display error message if any */}
        {error && <Typography color="error">{error}</Typography>}
        {/* Conditional rendering based on token */}
        {!token ? (
          <>
            <Button color="inherit" component={Link} to="/login" style={{
                backgroundColor: '#00796b', // Custom color for Create Playlist button
                color: 'white', // Text color
                padding: '8px 16px',
                borderRadius: '5px',
                textTransform: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight:'10px'
              }}>Login</Button>
            <Button color="inherit" component={Link} to="/signup" style={{
                backgroundColor: '#00796b', // Custom color for Create Playlist button
                color: 'white', // Text color
                padding: '8px 16px',
                borderRadius: '5px',
                textTransform: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight:'10px'
              }}>Signup</Button>
          </>
        ) : (
          <>
             <Button
              color="inherit"
              component={Link}
              to="/createplaylist"
              style={{
                backgroundColor: '#00796b', // Custom color for Create Playlist button
                color: 'white', // Text color
                padding: '8px 16px',
                borderRadius: '5px',
                textTransform: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight:'10px'
              }}
            >
              Create Playlist
            </Button>

            <Button
              className="logout-btn"
              color="inherit"
              onClick={logout}
              style={{
                width: '120px', 
                padding: '8px 16px',
                fontWeight: 'bold', 
                borderRadius: '5px', 
                backgroundColor: '#f44336', 
                color: 'white', 
                textTransform: 'none', 
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <ExitToAppIcon style={{ marginRight: '8px' }} /> {/* Logout Icon */}
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
