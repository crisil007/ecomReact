import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // For navigation
import axios from 'axios';  // For making API calls

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch the list of users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3005/getusers');  // Update API path as per your setup
                setUsers(response.data.data);  // Assuming the users are in 'data' field
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">User List</h1>
            
            <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left">Sl. No.</th>
                        <th className="py-3 px-6 text-left">User Type</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-gray-600">No users found</td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={user._id} className="border-b hover:bg-gray-100 transition-all duration-200">
                                <td className="py-4 px-6 text-center">{index + 1}</td>
                                <td className="py-4 px-6 text-center">{user.user_type ? user.user_type.user_type : 'N/A'}</td>
                                <td className="py-4 px-6 text-center">{user.email}</td>
                                <td className="py-4 px-6 text-center">
                                    <Link to={`/user/${user._id}`}>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">View</button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
