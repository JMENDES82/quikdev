import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');  
    const navigate = useNavigate();

    const handleCreatePost = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        setLoading(true); 
        setErrorMessage('');  

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',  
                },
            });
            navigate('/'); 
        } catch (error) {
            console.error('Falha ao criar postagem', error);
            setErrorMessage('Erro ao criar postagem. Tente novamente.');
        } finally {
            setLoading(false);  
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Criar Postagem</h1>

                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 h-32 resize-none"
                ></textarea>

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}
                
                <button
                    onClick={handleCreatePost}
                    className={`w-full py-2 text-white rounded-md ${
                        loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Criando...' : 'Criar Postagem'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
