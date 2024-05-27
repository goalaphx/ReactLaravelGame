import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

function AddGame() {
    const [name, setName] = useState("");
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [img, setImg] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlatformsAndCategories();
    }, []);

    async function fetchPlatformsAndCategories() {
        try {
            let platformsResult = await fetch("http://127.0.0.1:8000/api/listplat");
            platformsResult = await platformsResult.json();
            setPlatforms(platformsResult.map(platform => ({ label: platform.name, value: platform.id, image: platform.image })));
    
            let categoriesResult = await fetch("http://127.0.0.1:8000/api/listcat");
            categoriesResult = await categoriesResult.json();
            setCategories(categoriesResult.map(category => ({ label: category.name, value: category.id, logo: category.logo })));
        } catch (error) {
            console.error('Error fetching platforms or categories:', error);
        }
    }
    

    async function addGame(event) {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('img', img);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('link', link);
        selectedPlatforms.forEach(platform => formData.append('platforms[]', platform.value));
        selectedCategories.forEach(category => formData.append('categories[]', category.value));
    
        console.log([...formData]); // Log formData to ensure it's correct
    
        try {
            const result = await fetch("http://127.0.0.1:8000/api/addgame", {
                method: 'POST',
                body: formData
            });
            if (result.ok) {
                alert("Game has been Added");
                navigate('/');
            } else {
                alert("Error adding game");
            }
        } catch (error) {
            console.error('Error adding game:', error);
            alert("Error adding game");
        }
    }
    

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Add Game</h1>
                        <Form onSubmit={addGame}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter game name"
                                />
                            </Form.Group>

                            <Form.Group controlId="platforms" className="mb-3">
                                <Form.Label>Platforms</Form.Label>
                                <MultiSelect
                                    options={platforms}
                                    value={selectedPlatforms}
                                    onChange={setSelectedPlatforms}
                                    labelledBy="Select Platforms"
                                    optionRenderer={(option, isSelected) => (
                                        <div className="custom-option">
                                            <img src={`http://127.0.0.1:8000/${option.image}`} alt={option.label} className="mr-2" />
                                            <span>{option.label}</span>
                                        </div>
                                    )}
                                />
                            </Form.Group>

                            <Form.Group controlId="categories" className="mb-3">
                                <Form.Label>Categories</Form.Label>
                                <MultiSelect
                                    options={categories}
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    labelledBy="Select Categories"
                                    optionRenderer={(option, isSelected) => (
                                        <div className="custom-option">
                                            <img src={`http://127.0.0.1:8000/${option.logo}`} alt={option.label} className="mr-2" />
                                            <span>{option.label}</span>
                                        </div>
                                    )}
                                />
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter game description"
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
                                    placeholder="Enter game link"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Add Game
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AddGame;
