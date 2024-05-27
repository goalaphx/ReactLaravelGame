import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Header from './Header';
import { MultiSelect } from 'react-multi-select-component';

function UpdateGame() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [img, setImg] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                let result = await fetch(`http://127.0.0.1:8000/api/game/` + id);
                result = await result.json();
                setData(result);
                setName(result.name);
                setDescription(result.description);
                setLink(result.link);
                setSelectedPlatforms(result.platforms.map(platform => ({ label: platform.name, value: platform.id })));
                setSelectedCategories(result.categories.map(category => ({ label: category.name, value: category.id })));
            } catch (error) {
                console.error('Error fetching the game data:', error);
            }
        }
    
        async function fetchPlatformsAndCategories() {
            try {
                let platformsResult = await fetch('http://127.0.0.1:8000/api/listplat');
                platformsResult = await platformsResult.json();
                setPlatforms(platformsResult.map(platform => ({ label: platform.name, value: platform.id })));
    
                let categoriesResult = await fetch('http://127.0.0.1:8000/api/listcat');
                categoriesResult = await categoriesResult.json();
                setCategories(categoriesResult.map(category => ({ label: category.name, value: category.id })));
            } catch (error) {
                console.error('Error fetching platforms or categories:', error);
            }
        }
    
        getData();
        fetchPlatformsAndCategories();
    }, [id]);
    

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        if (img) {
            formData.append('img', img);
        }
        formData.append('name', name);
        formData.append('description', description);
        formData.append('link', link);
        selectedPlatforms.forEach(platform => formData.append('platforms[]', platform.value));
        selectedCategories.forEach(category => formData.append('categories[]', category.value));

        try {
            const result = await fetch(`http://127.0.0.1:8000/api/update/` + id, {
                method: 'POST',
                body: formData
            });

            if (result.ok) {
                navigate('/');
            } else {
                console.error('Error updating the game:', result.statusText);
            }
        } catch (error) {
            console.error('Error updating the game:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Update Game</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="description" className="my-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="link" className="my-3">
                                <Form.Label>Link</Form.Label>
                                <Form.Control type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="platforms" className="mb-3">
                                <Form.Label>Platforms</Form.Label>
                                <MultiSelect
                                    options={platforms}
                                    value={selectedPlatforms}
                                    onChange={setSelectedPlatforms}
                                    labelledBy="Select Platforms"
                                />
                            </Form.Group>

                            <Form.Group controlId="categories" className="mb-3">
                                <Form.Label>Categories</Form.Label>
                                <MultiSelect
                                    options={categories}
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    labelledBy="Select Categories"
                                />
                            </Form.Group>

                            <Form.Group controlId="img" className="my-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="img" onChange={(e) => setImg(e.target.files[0])} />
                                {data.img_path && (
                                    <Image
                                        className="my-3"
                                        style={{ width: 120, height: 120 }}
                                        src={`http://127.0.0.1:8000/${data.img_path}`}
                                        alt=""
                                        thumbnail
                                    />
                                )}
                            </Form.Group>

                            <Button variant="primary" className="mb-3" type="submit">
                                Update
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default UpdateGame;
