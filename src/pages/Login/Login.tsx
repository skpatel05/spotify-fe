import React from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import './Login.css'; // Import the CSS for this component
import { login } from '../../services/api'; // Update the API call as per login functionality

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});



const Login: React.FC = () => {

  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res:any = await login(values); 
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res._id);
      navigate('/createplaylist')
    } catch (error) {
      alert('Something went wrong');
    }
  };
  
  return (
    <Container maxWidth="sm" className="login-container">
      <Box className="login-box">
        <h2 className="login-title">Login to Your Account</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ touched, errors }) => (
            <Form>
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

              {/* Submit Button */}
              <Box mt={2} display="flex" justifyContent="center">
                <Button type="submit" className="custom-button">
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
