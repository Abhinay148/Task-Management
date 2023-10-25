import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../App.css';
import 'font-awesome/css/font-awesome.min.css';

const Admin = () => {
    const [userData, setUserData] = useState([]);
    const Token = localStorage.getItem("authToken");

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/getdata", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': Token
                  },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='admin'>
            <h1>Welcome! Back</h1>
            <h2>Manage or Assign Task Task</h2>
            <table id="User-list">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email-id</th>
                        <th>View Updates/Assign</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link to={`/user/${user._id}`}>
                                    <i className="fa fa-pencil"></i>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
