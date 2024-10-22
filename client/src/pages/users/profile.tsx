import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setUser(response.data);
        });
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
};

export default ProfilePage;
