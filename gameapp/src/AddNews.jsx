import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function AddNews() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [gameId, setGameId] = useState("");
    const [emulatorId, setEmulatorId] = useState("");
    const [games, setGames] = useState([]);
    const [emulators, setEmulators] = useState([]);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
        fetchEmulators();
    }, []);

    async function fetchGames() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/list");
            const data = await response.json();
            setGames(data.map(game => ({ label: game.name, value: game.id })));
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    }

    async function fetchEmulators() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/listemu");
            const data = await response.json();
            setEmulators(data.map(emulator => ({ label: emulator.name, value: emulator.id })));
        } catch (error) {
            console.error('Error fetching emulators:', error);
        }
    }

    async function addNews(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('game_id', gameId);
        formData.append('emulator_id', emulatorId);
        formData.append('image', image);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/news/add", {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert("News has been added");
                navigate('/manage-news');
            } else {
                alert("Error adding news");
            }
        } catch (error) {
            console.error('Error adding news:', error);
            alert("Error adding news");
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Add News</h1>
                        <Form onSubmit={addNews}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter news title"
                                />
                            </Form.Group>

                            <Form.Group controlId="content" className="mb-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter news content"
                                />
                            </Form.Group>

                            <Form.Group controlId="gameId" className="mb-3">
                                <Form.Label>Game</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={gameId}
                                    onChange={(e) => setGameId(e.target.value)}
                                >
                                    <option value="">Select Game</option>
                                    {games.map(game => (
                                        <option key={game.value} value={game.value}>
                                            {game.label}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="emulatorId" className="mb-3">
                                <Form.Label>Emulator</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={emulatorId}
                                    onChange={(e) => setEmulatorId(e.target.value)}
                                >
                                    <option value="">Select Emulator</option>
                                    {emulators.map(emulator => (
                                        <option key={emulator.value} value={emulator.value}>
                                            {emulator.label}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="image" className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Add News
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AddNews;
