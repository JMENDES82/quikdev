import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const isLoggedIn = () => {
        return !!localStorage.getItem('token'); 
    };

  
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 p-4">
            <div className="container mx-auto">
                <ul className="flex space-x-4 justify-center text-white">
                   
                    <li>
                        <Link
                            to="/"
                            className={`hover:text-indigo-300 ${
                                location.pathname === '/' ? 'underline font-bold' : ''
                            }`}
                        >
                            Home
                        </Link>
                    </li>

                    
                    {isLoggedIn() ? (
                        <>
                           
                            <li>
                                <Link
                                    to="/posts/create"
                                    className={`hover:text-indigo-300 ${
                                        location.pathname === '/posts/create'
                                            ? 'underline font-bold'
                                            : ''
                                    }`}
                                >
                                    Nova postagem
                                </Link>
                            </li>
                            
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-indigo-300 underline"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            
                            <li>
                                <Link
                                    to="/login"
                                    className={`hover:text-indigo-300 ${
                                        location.pathname === '/login'
                                            ? 'underline font-bold'
                                            : ''
                                    }`}
                                >
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
