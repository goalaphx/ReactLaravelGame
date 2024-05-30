import React, { useState, useEffect } from 'react';
import { NavDropdown, Container, Nav, Navbar, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; // Import your CSS file

function Header() {
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            fetchNotifications();
        }
    }, []);

    const fetchNotifications = () => {
        const userInfo = localStorage.getItem("user-info");
        if (!userInfo) return;

        const userId = JSON.parse(userInfo).id;
        fetch(`http://127.0.0.1:8000/api/notifications/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setNotifications(data))
            .catch(error => console.error('Error fetching notifications:', error.message));
    };

    const handleShowNotifications = () => setShow(true);
    const handleClose = () => setShow(false);

    const markAsRead = (id) => {
        fetch(`http://127.0.0.1:8000/api/notifications/mark-as-read/${id}`, { method: 'POST' })
            .then(() => fetchNotifications())
            .catch(error => console.error('Error marking notification as read:', error));
    };

    const removeNotification = (id) => {
        fetch(`http://127.0.0.1:8000/api/notifications/${id}`, { method: 'DELETE' })
            .then(() => fetchNotifications())
            .catch(error => console.error('Error removing notification:', error));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/register");
    };

    const unreadCount = notifications.filter(notification => !notification.read_status).length;
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    const isAdmin = userInfo && userInfo.roles && userInfo.roles.includes('Admin');

    return (
        <>
            <Navbar bg="danger" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/home">GameHub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {localStorage.getItem('user-info') ?
                                <>
                                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/news">News</Nav.Link>
                                    <Nav.Link as={Link} to="/games">Games</Nav.Link>
                                    <Nav.Link as={Link} to="/emus">Emulators</Nav.Link>
                                    <Nav.Link as={Link} to="/events">Events</Nav.Link>
                                    <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
                                    {isAdmin && (
                                        <NavDropdown title="Admin Tools" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/">Manage Games</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/listemu">Manage Emulators</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/listplat">Manage Platforms</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/listcat">Manage Categories</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/listevent">Manage Events</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/manage-news">Manage News</NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                </>
                                :
                                <>
                                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            }
                        </Nav>
                        {localStorage.getItem('user-info') &&
                            <Nav>
                                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Item>
                                    <Nav.Link onClick={handleShowNotifications} className="notification-box">
                                        <FontAwesomeIcon icon={faBell} className="fa-bell" /> {/* Bell icon from Font Awesome */}
                                        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Notification Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length === 0 ? (
                        <p>No Notifications</p>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification.id} className="notification-item">
                                <p>{notification.message}</p>
                                <Button
                                    variant="primary"
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={notification.read_status}
                                >
                                    Mark as Read
                                </Button>
                                <Button variant="danger" onClick={() => removeNotification(notification.id)}>
                                    Remove
                                </Button>
                            </div>
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Header;
