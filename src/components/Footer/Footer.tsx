import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'black', padding: '10px', textAlign: 'center' }}>
      <Typography variant="body2" color="white">
        © 2024 Spotify
      </Typography>
    </Box>
  );
};

export default Footer;
