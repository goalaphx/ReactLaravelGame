import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './Header'; // Import your Header component
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = JSON.parse(localStorage.getItem('user-info'));
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userInfo.id}`);
            const data = await response.json();
            setUser(data);
            setProfilePic(data.profilepic === 'empty.jpg' ? '/profile_pics/Default.jpg' : `http://127.0.0.1:8000/profile_pics/${data.profilepic}`);
        };
        fetchUser();
    }, []);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        setProfilePic(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleProfilePicSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profilepic', profilePic);
        formData.append('user_id', user.id);

        await fetch(`http://127.0.0.1:8000/api/user/update-profile-pic`, {
            method: 'POST',
            body: formData
        });

        // Refresh user data
        const response = await fetch(`http://127.0.0.1:8000/api/user/${user.id}`);
        const data = await response.json();
        setUser(data);
        setProfilePic(data.profilepic === 'empty.jpg' ? 'http://127.0.0.1:8000/profile_pics/Default.jpg' : `http://127.0.0.1:8000/profile_pics/${data.profilepic}`);
        setPreview(''); // Reset preview after upload
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header /> {/* Include your Header component */}
            <Container className="profile-container">
                <Row>
                    <Col md={12}>
                        <Card className="profile-card">
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Image src={preview || profilePic} roundedCircle className="profile-pic" />
                                        <Form onSubmit={handleProfilePicSubmit}>
                                            <Form.Group controlId="formFile" className="mb-3">
                                                <Form.Label><b>Change Profile Picture</b></Form.Label>
                                                <Form.Control type="file" onChange={handleProfilePicChange} />
                                            </Form.Group>
                                            <Button variant="primary" type="submit">Save</Button>
                                        </Form>
                                    </Col>
                                    <Col md={8}>
                                        <Card.Title>Profile</Card.Title>
                                        <Card.Text>
                                            <strong>Username:</strong> {user.name}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Email:</strong> {user.email}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Status:</strong> {user.roles}
                                        </Card.Text>
                                        {/* Add other user details as needed */}
                                        <Button variant="primary" as={Link} to="/favorites">Check Favorites</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Profile;
