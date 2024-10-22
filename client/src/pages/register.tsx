import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/auth/register', {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                if (err.response && err.response.data.message) {
                    setErrorMessage(err.response.data.message); 
                } else {
                    setErrorMessage('Erro ao registrar. Tente novamente.');
                }
            } else {
                setErrorMessage('Erro ao registrar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Registrar</h1>

                {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                )}

                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                    onClick={handleRegister}
                    className={`w-full py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={loading}
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>

                <p className="text-center text-gray-600">
                    Já tem uma conta?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-indigo-600 hover:underline"
                    >
                        Fazer login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
