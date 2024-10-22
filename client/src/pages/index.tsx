import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
    const [editingPostId, setEditingPostId] = useState<number | null>(null); 
    const [editText, setEditText] = useState<string>('');
    const [editingComment, setEditingComment] = useState<{ [key: number]: string }>({});
    const [expandedPosts, setExpandedPosts] = useState<number[]>([]); 
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        axios.get('/api/posts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar postagens:', error);
            });
    }, []);

    
    const handleLike = async (postId: number) => {
        try {
            await axios.post(`/api/posts/${postId}/like`);
            const updatedPosts = posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post);
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Erro ao curtir a postagem:', error);
        }
    };


    const handleDislike = async (postId: number) => {
        try {
            await axios.post(`/api/posts/${postId}/dislike`);
            const updatedPosts = posts.map(post => post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post);
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Erro ao dar dislike na postagem:', error);
        }
    };

    
    const handleCommentSubmit = async (postId: number) => {
        const comment = commentText[postId];
        if (!comment) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/comments/${postId}`, 
                {
                    postId: postId,
                    description: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const updatedPosts = posts.map(post =>
                post.id === postId
                    ? { ...post, comments: [...post.comments, { id: Date.now(), description: comment, userId, isDeleted: false }] }
                    : post
            );
            setPosts(updatedPosts);
            setCommentText({ ...commentText, [postId]: '' });
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
        }
    };

   
    const handleCommentChange = (postId: number, value: string) => {
        setCommentText({ ...commentText, [postId]: value });
    };

   
    const togglePostExpansion = async (postId: number) => {
        if (expandedPosts.includes(postId)) {
            setExpandedPosts(expandedPosts.filter(id => id !== postId)); 
        } else {
            setExpandedPosts([...expandedPosts, postId]); 

            
            try {
                await axios.post(`/api/posts/${postId}/view`);
                const updatedPosts = posts.map(post => post.id === postId ? { ...post, views: post.views + 1 } : post);
                setPosts(updatedPosts);
            } catch (error) {
                console.error('Erro ao incrementar visualizações:', error);
            }
        }
    };

    
    const handleEdit = (postId: number, description: string) => {
        setEditingPostId(postId);
        setEditText(description);
    };

    
    const handleSaveEdit = async (postId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/posts/${postId}`, 
                { description: editText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedPosts = posts.map(post =>
                post.id === postId
                    ? { 
                        ...post, 
                        description: editText, 
                        editHistory: Array.isArray(post.editHistory)
                            ? [...post.editHistory, post.description] 
                            : [post.description] 
                    }
                    : post
            );
            setPosts(updatedPosts);
            setEditingPostId(null); 
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
        }
    };

    
    const handleDelete = async (postId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Erro ao excluir a postagem:', error);
        }
    };

    
    const handleEditComment = (commentId: number, currentText: string) => {
        setEditingComment({ ...editingComment, [commentId]: currentText });
    };

    const handleSaveCommentEdit = async (commentId: number, postId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/comments/${commentId}`, 
                { description: editingComment[commentId] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    const updatedComments = post.comments.map((comment: any) =>
                        comment.id === commentId ? { ...comment, description: editingComment[commentId] } : comment
                    );
                    return { ...post, comments: updatedComments };
                }
                return post;
            });

            setPosts(updatedPosts);
            const updatedEditingComments = { ...editingComment };
            delete updatedEditingComments[commentId];
            setEditingComment(updatedEditingComments);
        } catch (error) {
            console.error('Erro ao salvar edição do comentário:', error);
        }
    };


    const handleDeleteComment = async (commentId: number, postId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    const updatedComments = post.comments.filter((comment: any) => comment.id !== commentId);
                    return { ...post, comments: updatedComments };
                }
                return post;
            });
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Erro ao excluir o comentário:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 justify-center items-center min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Postagens</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 
                            className="text-xl font-semibold mb-2 cursor-pointer"
                            onClick={() => togglePostExpansion(post.id)}
                        >
                            {post.title}
                        </h2>
                        <div className="flex space-x-4 text-gray-600">
                            <p>Visualizações: {post.views}</p>
                            <p>Curtidas: {post.likes}</p>
                            <p>Descurtidas: {post.dislikes}</p>
                        </div>

                        {expandedPosts.includes(post.id) && (
                            <>
                                <div className="mt-4">
                                    {editingPostId === post.id ? (
                                        <div>
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            <button
                                                onClick={() => handleSaveEdit(post.id)}
                                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 mb-4 whitespace-pre-line">{post.description}</p>
                                    )}

                                    {post.imageUrl && (
                                        <img
                                            src={`http://${post.imageUrl}`}
                                            alt={post.title}
                                            className="w-full h-auto max-h-64 object-cover rounded-md"
                                        />
                                    )}
                                </div>

                               
                                {post.editHistory && (
                                    <div className="mt-4 text-gray-600">
                                        <h4 className="font-semibold">Histórico de Edições:</h4>
                                        <ul>
                                            {JSON.parse(post.editHistory).map((edit: any, index: number) => (
                                                <li key={index}>{`${edit.date}: ${edit.action}`}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Curtir
                                    </button>
                                    <button
                                        onClick={() => handleDislike(post.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Não curtir
                                    </button>

                                    {post.userId === userId && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(post.id, post.description)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {post.comments.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold">Comentários</h3>
                                        <ul className="list-disc pl-4">
                                            {post.comments
                                                .filter((comment: any) => !comment.isDeleted) 
                                                .map((comment: any) => (
                                                    <li key={comment.id} className="text-gray-700">
                                                        {editingComment[comment.id] !== undefined ? (
                                                            <div>
                                                                <input
                                                                    value={editingComment[comment.id]}
                                                                    onChange={(e) => handleEditComment(comment.id, e.target.value)}
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                                />
                                                                <button
                                                                    onClick={() => handleSaveCommentEdit(comment.id, post.id)}
                                                                    className="mt-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                                >
                                                                    Salvar
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span>{comment.description}</span>
                                                                {comment.userId === userId && (
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleEditComment(comment.id, comment.description)}
                                                                            className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                                        >
                                                                            Editar
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteComment(comment.id, post.id)}
                                                                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                                        >
                                                                            Excluir
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Adicione um comentário"
                                        value={commentText[post.id] || ''}
                                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                    <button
                                        onClick={() => handleCommentSubmit(post.id)}
                                        className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
