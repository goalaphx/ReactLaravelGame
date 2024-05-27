import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const navigate = useNavigate();

    async function handleAddCategory(event) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('img', logo);
        formData.append('name', name);
        
        try {
            let result = await fetch("http://127.0.0.1:8000/api/addcat", {
                method: 'POST',
                body: formData
            });
            result = await result.json();
            alert("Category has been Added");
            navigate('/listcat');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Add Category</h1>
                        <Form onSubmit={handleAddCategory}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter category name"
                                />
                            </Form.Group>

                            <Form.Group controlId="img" className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Add Category
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AddCategory;
