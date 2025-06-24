import React, { useEffect, useState } from 'react';
import {
    Grid, Typography, Box, CircularProgress, Alert, Button, Paper, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchProducts, searchProducts, filterProducts, deleteProduct } from '../api/api';
import ProductItem from './ProductItem';

const ProductList = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    const categories = [
        'Electronics', 'Clothing', 'Books', 'Home & Garden',
        'Sports', 'Beauty', 'Automotive', 'Food & Beverages', 'Toys', 'Other'
    ];

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            loadProducts();
        }
    }, [searchTerm]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchProducts();
            setProducts(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadProducts();
            return;
        }

        try {
            setLoading(true);
            const response = await searchProducts(searchTerm);
            setProducts(response.data);
            setError('');
        } catch (err) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = async (category) => {
        setSelectedCategory(category);
        if (!category) {
            loadProducts();
            return;
        }

        try {
            setLoading(true);
            const response = await filterProducts(category);
            setProducts(response.data);
            setError('');
        } catch (err) {
            setError('Filter failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter(product => product.id !== productId));
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    return (
        <Box display="flex" gap={3}>
            {/* Sidebar Filters */}
            {showFilters && (
                <Paper elevation={3} sx={{ p: 3, width: 250, borderRadius: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setShowFilters(false)}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Category</FormLabel>
                        <RadioGroup
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                        >
                            <FormControlLabel value="" control={<Radio />} label="All Categories" />
                            {categories.map(category => (
                                <FormControlLabel
                                    key={category}
                                    value={category}
                                    control={<Radio />}
                                    label={category}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setSelectedCategory('');
                            loadProducts();
                        }}
                    >
                        Clear All Filters
                    </Button>
                </Paper>
            )}

            {/* Main Content */}
            <Box flexGrow={1}>
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                        Products ({products.length})
                    </Typography>
                    {!showFilters && (
                        <Button startIcon={<FilterListIcon />} onClick={() => setShowFilters(true)}>
                            Show Filters
                        </Button>
                    )}
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <CircularProgress size={50} />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                        <Button onClick={loadProducts} sx={{ ml: 2 }} size="small" variant="outlined">
                            Try Again
                        </Button>
                    </Alert>
                )}

                {!loading && products.length === 0 && !error && (
                    <Typography variant="body1" align="center" mt={10} color="text.secondary">
                        No products found. Try changing search or filters.
                    </Typography>
                )}

                {!loading && products.length > 0 && (
                    <Grid container spacing={3}>
                        {products.map(product => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                <ProductItem product={product} onDelete={handleDeleteProduct} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default ProductList;
