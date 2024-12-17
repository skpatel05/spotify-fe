import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography, Paper } from '@mui/material';
import './CreatePlaylist.css'; // Create this CSS file for styling
import { createPlaylist } from '../../services/api'; 

// Validation schema using Yup
const validationSchema = Yup.object({
  playlistName: Yup.string()
    .min(3, 'Playlist name must be at least 3 characters')
    .required('Playlist name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  singerName: Yup.string()
    .min(3, 'Singer name must be at least 3 characters')
    .required('Singer name is required'),
});

// Interface for form values
interface PlaylistValues {
  playlistName: string;
  description: string;
  singerName: string;
}

const CreatePlaylist: React.FC = () => {
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (values: PlaylistValues) => {
    try {
      const userId = localStorage.getItem('userId') || ''; // Get userId from localStorage or another state if necessary
      if (!userId) {
        console.log('User ID is missing');
        return;
      }

      const playlistData = { ...values, userId };
      const response: any = await createPlaylist(playlistData);

      if (response.status === 'success') {
        // Redirect to the playlist list or another page after success
        navigate("/home");
      } else {
        console.log('Failed to create playlist.');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="playlist-form-container">
        <Typography variant="h4" align="center" gutterBottom className="form-title">
          Create New Playlist
        </Typography>
        <Formik
          initialValues={{
            playlistName: '',
            description: '',
            singerName: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              {/* Playlist Name Field */}
              <Box mb={3}>
                <Field
                  name="playlistName"
                  as={TextField}
                  label="Playlist Name"
                  variant="outlined"
                  fullWidth
                  error={touched.playlistName && Boolean(errors.playlistName)}
                  helperText={touched.playlistName && errors.playlistName}
                />
              </Box>

              {/* Description Field */}
              <Box mb={3}>
                <Field
                  name="description"
                  as={TextField}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Box>

              {/* Singer Name Field */}
              <Box mb={3}>
                <Field
                  name="singerName"
                  as={TextField}
                  label="Singer Name"
                  variant="outlined"
                  fullWidth
                  error={touched.singerName && Boolean(errors.singerName)}
                  helperText={touched.singerName && errors.singerName}
                />
              </Box>

              {/* Submit Button */}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" className='playlist-btn' variant="contained" color="primary" size="large">
                  Create Playlist
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default CreatePlaylist;
