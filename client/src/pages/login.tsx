import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error: any) {  
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);  
            } else {
                setErrorMessage('Erro ao fazer login. Tente novamente.'); 
            }
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); 
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                )}

                <button
                    onClick={handleLogin}
                    className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Login
                </button>
                <p className="text-center text-gray-600">
                    Não tem uma conta?{' '}
                    <button
                        onClick={handleRegisterRedirect}
                        className="text-indigo-600 hover:underline"
                    >
                        Registrar-se
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
