import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowRegister(false);
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    if (isLoggedIn) {
        return <Dashboard onLogout={handleLogout} />;
    }

    if (showRegister) {
        return (
            <Register
                onRegisterSuccess={handleRegisterSuccess}
                onBackToLogin={() => setShowRegister(false)}
            />
        );
    }

    return (
        <div>
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="fixed bottom-4 right-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowRegister(true)}
                >
                    Don't have an account? Register
                </button>
            </div>
        </div>
    );
}

export default App;