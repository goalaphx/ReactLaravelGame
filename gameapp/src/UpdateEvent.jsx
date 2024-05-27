import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Header from './Header';

function UpdateEvent() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [logo, setLogo] = useState(null);
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                let result = await fetch(`http://127.0.0.1:8000/api/events/${id}`);
                result = await result.json();
                setData(result);
                setName(result.name);
                setDescription(result.description);
                setLink(result.link);
                setSelectedGame({ label: result.game.name, value: result.game.id });
            } catch (error) {
                console.error('Error fetching the event data:', error);
            }
        }

        async function fetchGames() {
            try {
                let gamesResult = await fetch('http://127.0.0.1:8000/api/list');
                gamesResult = await gamesResult.json();
                setGames(gamesResult.map(game => ({ label: game.name, value: game.id })));
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        }

        getData();
        fetchGames();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        if (logo) {
            formData.append('logo', logo);
        }
        formData.append('name', name);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('game_id', selectedGame.value);

        try {
            const result = await fetch(`http://127.0.0.1:8000/api/events/update/${id}`, {
                method: 'POST',
                body: formData
            });

            if (result.ok) {
                navigate('/events');
            } else {
                console.error('Error updating the event:', result.statusText);
            }
        } catch (error) {
            console.error('Error updating the event:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Update Event</h1>
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

                            <Form.Group controlId="game" className="mb-3">
                                <Form.Label>Game</Form.Label>
                                <Form.Control as="select" value={selectedGame ? selectedGame.value : ''} onChange={(e) => setSelectedGame(games.find(game => game.value === parseInt(e.target.value)))}>
                                    <option value="">Select a game</option>
                                    {games.map(game => (
                                        <option key={game.value} value={game.value}>{game.label}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="logo" className="my-3">
                                <Form.Label>Logo</Form.Label>
                                <Form.Control type="file" name="logo" onChange={(e) => setLogo(e.target.files[0])} />
                                {data.logo && (
                                    <Image
                                        className="my-3"
                                        style={{ width: 120, height: 120 }}
                                        src={`http://127.0.0.1:8000/${data.logo}`}
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

export default UpdateEvent;
