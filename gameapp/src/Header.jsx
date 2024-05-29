import React from 'react';
import { NavDropdown, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    let user = JSON.parse(localStorage.getItem("user-info"));
    const navigate = useNavigate();

    function logOut() {
        localStorage.clear();
        navigate("/register");
    }

    return (
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
                                <NavDropdown title="Admin Tools" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/">Manage Games</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/listemu">Manage Emulators</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/listplat">Manage Platforms</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/listcat">Manage Categories</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/listevent">Manage Events</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/manage-news">Manage News</NavDropdown.Item>


                                </NavDropdown>
                            </>
                            :
                            <>
                                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        }
                    </Nav>
                    {localStorage.getItem('user-info') ?
                        <Nav>
                            <NavDropdown title={user && user.name} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        : null
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
