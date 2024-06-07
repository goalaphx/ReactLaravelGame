import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/home");
        }
    }, []);

    async function login(event) {
        event.preventDefault();

        let item = { email, password };

        try {
            let result = await fetch("http://127.0.0.1:8000/api/login", {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (!result.ok) {
                throw new Error('Login failed');
            }

            result = await result.json();

            if (result.error) {
                throw new Error(result.error);
            }

            localStorage.setItem("user-info", JSON.stringify(result));
            navigate("/home");
        } catch (error) {
            console.error('Login failed:', error.message);
            alert('Login failed: ' + error.message);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <h1 className="my-4 text-center">Login</h1>
                        <Form onSubmit={login}>
                            <Form.Group controlId="email" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                />
                            </Form.Group>

                            <Form.Group controlId="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Login
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;