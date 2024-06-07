import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateNews() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [gameId, setGameId] = useState("");
    const [emulatorId, setEmulatorId] = useState("");
    const [games, setGames] = useState([]);
    const [emulators, setEmulators] = useState([]);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
        fetchGames();
        fetchEmulators();
    }, []);

    async function fetchNews() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/news/${id}`);
            const data = await response.json();
            setTitle(data.title);
            setContent(data.content);
            setGameId(data.game_id || "");
            setEmulatorId(data.emulator_id || "");
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

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
            const response = await fetch("http://127.0.0.1:8000/api/emulators/list");
            const data = await response.json();
            setEmulators(data.map(emulator => ({ label: emulator.name, value: emulator.id })));
        } catch (error) {
            console.error('Error fetching emulators:', error);
        }
    }

    async function updateNews(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('game_id', gameId);
        formData.append('emulator_id', emulatorId);
        formData.append('image', image);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/news/update/${id}`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                navigate('/news'); // Redirect to news list
            } else {
                console.error('Failed to update news');
            }
        } catch (error) {
            console.error('Error updating news:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center">Update News</h1>
                <Form onSubmit={updateNews}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="content" className="mt-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="game" className="mt-3">
                        <Form.Label>Game</Form.Label>
                        <Form.Control
                            as="select"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                        >
                            <option value="">Select a game (optional)</option>
                            {games.map(game => (
                                <option key={game.value} value={game.value}>{game.label}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="emulator" className="mt-3">
                        <Form.Label>Emulator</Form.Label>
                        <Form.Control
                            as="select"
                            value={emulatorId}
                            onChange={(e) => setEmulatorId(e.target.value)}
                        >
                            <option value="">Select an emulator (optional)</option>
                            {emulators.map(emulator => (
                                <option key={emulator.value} value={emulator.value}>{emulator.label}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="image" className="mt-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-4 mb-2">
                        Update News
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default UpdateNews;
