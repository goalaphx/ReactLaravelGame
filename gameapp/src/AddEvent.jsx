import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function AddEvent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [gameId, setGameId] = useState("");
    const [games, setGames] = useState([]);
    const [logo, setLogo] = useState(null);
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
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

    async function addEvent(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('game_id', gameId);
        formData.append('logo', logo);
        formData.append('link', link);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/events/add", {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert("Event has been added");
                navigate('/events');
            } else {
                alert("Error adding event");
            }
        } catch (error) {
            console.error('Error adding event:', error);
            alert("Error adding event");
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Add Event</h1>
                        <Form onSubmit={addEvent}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter event name"
                                />
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter event description"
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

                            <Form.Group controlId="logo" className="mb-3">
                                <Form.Label>Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                />
                            </Form.Group>

                            <Form.Group controlId="link" className="mb-3">
                                <Form.Label>Link</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="Enter event link"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Add Event
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AddEvent;
