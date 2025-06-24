import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Chip,
    Box,
    Avatar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductItem = ({ product, onDelete }) => {
    const [imageError, setImageError] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const truncateText = (text, limit) => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    return (
        <Card elevation={4} sx={{ maxWidth: 345, borderRadius: 3, position: 'relative' }}>
            {/* Product Image */}
            {!imageError ? (
                <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:8080/uploads/${product.image}`}
                    alt={product.productName}
                    onError={handleImageError}
                />
            ) : (
                <Box height={200} display="flex" justifyContent="center" alignItems="center" bgcolor="#f5f5f5">
                    <Avatar sx={{ width: 80, height: 80 }}>📷</Avatar>
                </Box>
            )}

            {/* Category Badge */}
            {product.category && (
                <Chip
                    label={product.category}
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                />
            )}

            {/* Delete Button */}
            <Button
                onClick={() => onDelete(product.id)}
                size="small"
                color="error"
                sx={{ position: 'absolute', top: 16, right: 16 }}
            >
                <DeleteIcon />
            </Button>

            {/* Product Details */}
            <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.productName}
                </Typography>

                <Typography variant="h5" color="green" gutterBottom>
                    ₹{product.productPrice?.toLocaleString()}
                </Typography>

                {product.productDesc && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {showFullDescription ? product.productDesc : truncateText(product.productDesc, 100)}
                        {product.productDesc.length > 100 && (
                            <Button onClick={() => setShowFullDescription(!showFullDescription)} size="small">
                                {showFullDescription ? 'Show less' : 'Read more'}
                            </Button>
                        )}
                    </Typography>
                )}

                {product.features && (
                    <Typography variant="body2" color="text.secondary">
                        <b>Features:</b> {truncateText(product.features, 80)}
                    </Typography>
                )}
            </CardContent>

            {/* Action Buttons */}
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button size="small" variant="outlined" startIcon={<VisibilityIcon />}>
                    View Details
                </Button>
                <Button size="small" variant="contained" color="success" startIcon={<ShoppingCartIcon />}>
                    Add to Cart
                </Button>
            </CardActions>

            {/* Product ID (for debugging / recruiter showoff) */}
            <Typography variant="caption" color="gray" sx={{ pl: 2, pb: 1 }}>
                Product ID: {product.id}
            </Typography>
        </Card>
    );
};

export default ProductItem;
