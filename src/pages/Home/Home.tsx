import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Button } from '@mui/material';
import './Home.css'; // Import custom CSS
import { getPlaylistsByUserId, deletePlaylistById, createPlaylist } from '../../services/api'; // Import the API functions
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearch } from '../../components/searchContext';
import { useNavigate } from 'react-router-dom';
interface Playlist {
  _id: string;
  name: string;
  description: string;
  singerName: string;
}
interface SearchResult {
  song: string;
  artist: string;
  album: string;
  previewUrl: string | null;
}
const Home: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [dataupdate, setDataUpdate] = useState<boolean>(false);
  const { searchResults, setSearchResults } = useSearch();
  const navigate = useNavigate();
  console.log('Search Results>>>>', searchResults);
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
        if (userId) {
          const response = await getPlaylistsByUserId(userId);
          if (response.status === 'success') {
            setPlaylists(response.data); // Set playlists if API call is successful
          } else {
            setError('Failed to fetch playlists');
          }
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError('An error occurred while fetching playlists');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPlaylists(); // Call the function to fetch playlists
  }, [dataupdate]); // Empty dependency array ensures this runs once when the component mounts

  const handleDeletePlaylist = async (playlistId: string) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await deletePlaylistById(playlistId, userId); // Pass playlistId and userId
      if (response.status === 'success') {
        setPlaylists(playlists.filter(playlist => playlist._id !== playlistId)); // Remove playlist from state
      }
    } catch (error) {
      setError('Failed to delete playlist');
    }
  };

  const handleAddPlaylist = async (item: SearchResult) => {
    try {
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId') || ''; 
      if (!userId) {
        console.log('User ID is missing');
        return;
      }
  
      // Prepare data for the playlist, matching the PlaylistData interface
      const playlistData: any = {
        playlistName: item.song, // Assuming `item.song` is the playlist name
        description: item.album, // Assuming `item.album` is the description
        singerName: item.artist, // Assuming `item.artist` is the singer's name
        userId: userId, // Add the user ID
      };
  
      // Call the API to create the playlist
      const response: any = await createPlaylist(playlistData);
  
      if (response.status === 'success') {
        console.log('Playlist created successfully!');
        setSearchResults([])
        setDataUpdate((prevState) => !prevState);
        navigate('/home'); 
      } else {
        console.log('Failed to create playlist:', response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <Container maxWidth="lg" className="home-container">
      <Typography variant="h3" className="home-title">
        Welcome to Spotify App!
      </Typography>
    {searchResults.length > 0 ?<> <div style={{marginBottom: "80px"}}>
        <h2>Search Results</h2>
        {searchResults.length === 0 ? (
          <p>No results found</p>
        ) : (
          <Grid container spacing={2}>
            {searchResults.map((item: SearchResult, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box className="playlist-card">
                  <Typography variant="h6" className="playlist-name">{item.song}</Typography>
                  <Typography variant="body2" className="playlist-description">{item.album}</Typography>
                  <Typography variant="body2" color="textSecondary" className="playlist-singer">{item.artist}</Typography>
                  {item.previewUrl && (
                    <audio controls>
                      <source src={item.previewUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <Button
            variant="contained"
            onClick={() => handleAddPlaylist(item)}
             className="custom-button"
          >
            Add In Playlist
          </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </div></>:null}


      {loading ? (
        <Box className="loading-container">
          <CircularProgress size={60} color="secondary" />
        </Box>
      ) : error ? (
        <Typography color="error" className="error-message">{error}</Typography> // Display error message
      ) : (
        <Box>
  <Typography variant="h4" className="playlists-title">Your Playlists:</Typography>
  {playlists.length > 0 ? (
    <Grid container spacing={12} className="grid-container" >
    {playlists.map((playlist, index) => (
      <Grid item xs={12} sm={6} md={4} key={playlist._id}>
        <Box className="playlist-card">
          <Typography variant="h6" className="playlist-name">{playlist.name}</Typography>
          <Typography variant="body2" className="playlist-description">{playlist.description}</Typography>
          <Typography variant="body2" color="textSecondary" className="playlist-singer">{playlist.singerName}</Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeletePlaylist(playlist._id)}
            startIcon={<DeleteIcon />}
            className="delete-button"
          >
            DELETE
          </Button>
        </Box>
      </Grid>
    ))}
  </Grid>
  ) : (
    <Typography>No playlists found</Typography>
  )}
</Box>
      )}
    </Container>
  );
};

export default Home;
