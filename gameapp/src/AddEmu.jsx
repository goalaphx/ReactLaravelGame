import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import Multiselect from 'react-multiple-select-dropdown-lite';
import 'react-multiple-select-dropdown-lite/dist/index.css';

function AddEmu() {
    const [name, setName] = useState("");
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [image, setImg] = useState(null);
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlatforms();
    }, []);

    async function fetchPlatforms() {
        try {
            let platformsResult = await fetch("http://127.0.0.1:8000/api/listplat");
            platformsResult = await platformsResult.json();
            const formattedPlatforms = platformsResult.map(platform => ({
                label: platform.name,
                value: platform.id
            }));
            setPlatforms(formattedPlatforms);
        } catch (error) {
            console.error('Error fetching platforms:', error);
        }
    }

    async function addEmu(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('img', image);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('link', link);
        selectedPlatforms.forEach(id => formData.append('platform_ids[]', id));

        try {
            const result = await fetch("http://127.0.0.1:8000/api/addemu", {
                method: 'POST',
                body: formData
            });

            if (result.ok) {
                alert("Emulator has been added");
                navigate('/listemu');
            } else {
                console.error('Error adding emulator:', result.statusText);
            }
        } catch (error) {
            console.error('Error adding emulator:', error);
        }
    }

    const handlePlatformChange = (val) => {
        const selectedValues = val.split(',');
        setSelectedPlatforms(selectedValues);
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Add Emulator</h1>
                        <Form onSubmit={addEmu}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter emulator name"
                                />
                            </Form.Group>

                            <Form.Group controlId="platforms" className="mb-3">
                                <Form.Label>Platforms</Form.Label>
                                <Multiselect
                                    options={platforms}
                                    onChange={handlePlatformChange}
                                    placeholder="Select Platforms"
                                />
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter emulator description"
                                />
                            </Form.Group>

                            <Form.Group controlId="img" className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setImg(e.target.files[0])}
                                />
                            </Form.Group>

                            <Form.Group controlId="link" className="mb-3">
                                <Form.Label>Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="Enter emulator link"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Add Emulator
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AddEmu;
