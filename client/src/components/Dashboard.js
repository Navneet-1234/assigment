import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error fetching users');
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User updated successfully');
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating user');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User deleted successfully');
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deleting user');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            {message && <p className="message">{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            {editingUser && editingUser._id === user._id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={editingUser.fullName}
                                            onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={handleUpdate}>Save</button>
                                        <button onClick={() => setEditingUser(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user)}>Edit</button>
                                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;