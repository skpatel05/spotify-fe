import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import './Signup.css'; // Import the CSS for this component
import { register } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Signup: React.FC = () => {

  const [error , setError] = useState("");

  const navigate = useNavigate();
  
  const handleSignup = async (values: { name: string; email: string; password: string }) => {
    try {
      const res:any = await register(values)
      localStorage.setItem("token", res.token);
    localStorage.setItem("userId", res._id);
    setError("")
    navigate('/createplaylist')
  } catch (error: any) {
    setError(error.response.data.message);
  }
};

  return (
    <Container maxWidth="sm" className="signup-container">
      <Box className="signup-box">
        <h2 className="signup-title">Create Your Account</h2>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignup} 
        >
          {({ touched, errors }) => (
            <Form>
              {/* Name Field */}
              <Box mb={2}>
                <Field
                  name="name"
                  as={TextField}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  error={touched.name && Boolean(errors.name)} // Error handling
                  helperText={touched.name && errors.name} // Display error message
                />
              </Box>

              {/* Email Field */}
              <Box mb={2}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={touched.email && Boolean(errors.email)} // Error handling
                  helperText={touched.email && errors.email} // Display error message
                />
              </Box>

              {/* Password Field */}
              <Box mb={2}>
                <Field
                  name="password"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  error={touched.password && Boolean(errors.password)} // Error handling
                  helperText={touched.password && errors.password} // Display error message
                />
              </Box>
              <Box>
              <Typography component="span"  style={{color:'red'}}>
                {error}
              </Typography>
              </Box>
              {/* Submit Button */}
              <Box mt={2} display="flex" justifyContent="center">
                <Button  type="submit"  className="custom-button">
                  Signup
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Signup;
