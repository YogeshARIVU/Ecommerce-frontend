import React, { useState } from 'react';
import {
    TextField, Button, Box, Typography, CircularProgress, Alert, Paper, Stack
} from '@mui/material';
import { registerUser } from '../api/api';

const Register = ({ onRegisterSuccess, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await registerUser(formData);
            console.log('Registration response:', response);
            setSuccess('Registration successful! You can now login.');

            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'USER'
            });

            setTimeout(() => {
                onRegisterSuccess();
            }, 1500);

        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3} align="center">
                    Create Account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onBackToLogin}
                            fullWidth
                        >
                            Back to Login
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;
