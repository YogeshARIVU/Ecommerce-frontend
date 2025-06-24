import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import AddProduct from '../components/AddProduct';
import {
    AppBar, Toolbar, Typography, IconButton, Button, TextField, Box, Container, Avatar, Dialog, DialogContent
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Dashboard = ({ onLogout }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [refreshProducts, setRefreshProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const handleProductAdded = () => {
        setRefreshProducts(prev => prev + 1);
        setShowAddProduct(false);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar position="static" color="primary">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                        🛒 ShopCart Admin
                    </Typography>

                    {/* Search */}
                    <Box sx={{ flex: 1, mx: 3 }}>
                        <Box sx={{ display: 'flex', bgcolor: 'white', borderRadius: 2, p: 0.5 }}>
                            <TextField
                                variant="standard"
                                placeholder="Search products..."
                                InputProps={{ disableUnderline: true }}
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <IconButton color="primary">
                                <SearchIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Right Side */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddProduct(true)}
                        >
                            Add Product
                        </Button>

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">
                                Welcome,
                            </Typography>
                            <Typography variant="body2">{user.username || 'User'}</Typography>
                        </Box>

                        <Avatar sx={{ bgcolor: '#1976d2' }}>{(user.username || 'U')[0].toUpperCase()}</Avatar>

                        <IconButton color="inherit" onClick={onLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main */}
            <Container sx={{ mt: 4 }}>
                <ProductList key={refreshProducts} searchTerm={searchTerm} />
            </Container>

            {/* Add Product Modal */}
            <Dialog open={showAddProduct} onClose={() => setShowAddProduct(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <AddProduct onProductAdded={handleProductAdded} onCancel={() => setShowAddProduct(false)} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
