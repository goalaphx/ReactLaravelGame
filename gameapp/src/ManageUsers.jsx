import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Header from './Header';
import './AdminUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        // Fetch all users
        fetch('http://127.0.0.1:8000/api/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            });
    }, []);

    const handleDelete = (userId) => {
        fetch(`http://127.0.0.1:8000/api/user/delete/${userId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                setUsers(users.filter(user => user.id !== userId));
            });
    };

    const handleRoleChange = (userId) => {
        fetch(`http://127.0.0.1:8000/api/user/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roles: newRole }),
        })
            .then(response => response.json())
            .then(updatedUser => {
                setUsers(users.map(user => user.id === userId ? updatedUser : user));
                setShow(false);
            });
    };

    const handleShow = (user) => {
        setSelectedUser(user);
        setNewRole(user.roles);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1 className="mb-4 text-center">Manage Users</h1>
                <Table striped bordered hover className="custom-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.roles}</td>
                                <td>
                                    <Button variant="primary" className="mr-2" onClick={() => handleShow(user)}>
                                        Edit Role
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new role"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleRoleChange(selectedUser.id)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ManageUsers;
