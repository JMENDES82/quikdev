import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/index';
import LoginPage from './pages/login';
import CreatePost from './pages/posts/create';
import PostDetail from './pages/posts/[id]';
import ProfilePage from './pages/users/profile';
import RegisterPage from './pages/register';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/posts/create" element={<CreatePost />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/users/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
};

export default App;
