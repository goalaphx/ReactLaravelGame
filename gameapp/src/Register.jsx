import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reEnterEmail, setReEnterEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/home");
        }
    }, []);

    async function signUp(event) {
        event.preventDefault();

        if (email !== reEnterEmail) {
            alert("Emails don't match");
            return;
        }

        let item = {
            name: name,
            email: email,
            password: password,
            roles: "Player",
            profilepic: "empty.jpg",
        };

        try {
            let result = await fetch("http://127.0.0.1:8000/api/register", {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                }
            });

            if (!result.ok) {
                throw new Error('Registration failed');
            }

            navigate("/login"); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed:', error.message);
            alert('Registration failed: ' + error.message);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <h1 className="my-4 text-center">Register</h1>
                        <Form onSubmit={signUp}>
                            {/* Form fields */}
                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Register
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Register;
