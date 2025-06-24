import React, { useState } from 'react';
import { uploadProduct } from '../api/api';
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    CircularProgress,
    Box,
    Alert,
    Grid
} from '@mui/material';

const AddProduct = ({ onProductAdded, onCancel }) => {
    const [productData, setProductData] = useState({
        productName: '',
        productPrice: '',
        productDesc: '',
        category: '',
        features: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports',
        'Beauty', 'Automotive', 'Food & Beverages', 'Toys', 'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!productData.productName.trim()) {
            setError('Product name is required');
            return;
        }
        if (!productData.productPrice || parseFloat(productData.productPrice) <= 0) {
            setError('Please enter a valid price');
            return;
        }
        if (!productData.category) {
            setError('Please select a category');
            return;
        }
        if (!productData.productDesc.trim()) {
            setError('Product description is required');
            return;
        }
        if (!selectedFile) {
            setError('Please select an image file');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();

            // Create product object
            const product = {
                productName: productData.productName.trim(),
                productPrice: parseFloat(productData.productPrice),
                productDesc: productData.productDesc.trim(),
                category: productData.category,
                features: productData.features.trim() || ''
            };

            // Append as JSON string (this is key!)
            formData.append('product', JSON.stringify(product));
            formData.append('image', selectedFile);

            console.log('Sending product data:', product);
            console.log('Sending file:', selectedFile.name);

            const response = await uploadProduct(formData);
            console.log('Upload response:', response.data);

            setSuccess('Product added successfully!');

            // Reset form
            setProductData({
                productName: '',
                productPrice: '',
                productDesc: '',
                category: '',
                features: ''
            });
            setSelectedFile(null);
            setPreviewUrl('');

            if (onProductAdded) onProductAdded(response.data);
            setTimeout(() => onCancel(), 2000);

        } catch (err) {
            console.error('Upload error:', err);
            console.error('Error response:', err.response?.data);

            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to add product. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h4" align="center" gutterBottom>Add New Product</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Product Name"
                    name="productName"
                    value={productData.productName}
                    onChange={handleInputChange}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Price (₹)"
                    name="productPrice"
                    type="number"
                    inputProps={{ min: "0", step: "0.01" }}
                    value={productData.productPrice}
                    onChange={handleInputChange}
                    required
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        label="Category"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    name="productDesc"
                    value={productData.productDesc}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    required
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Features"
                    name="features"
                    value={productData.features}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                />

                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </Button>

                {previewUrl && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                                width: 150,
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ flex: 1 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add Product'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                        sx={{ flex: 1 }}
                    >
                        Cancel
                    </Button>
                </Box>

            </Box>
        </Container>
    );
};

export default AddProduct;