import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axiosConfig';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        axios.get(`/api/posts/${id}`).then((response) => {
            setPost(response.data);
        });
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <img src={`/images/${post.imageUrl}`} alt={post.title} />
            <p>Views: {post.views}</p>
            <p>Likes: {post.likes}</p>
            <p>Dislikes: {post.dislikes}</p>
        </div>
    );
};

export default PostDetail;
