import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import './GamePage.css';

function GamesPage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        async function fetchGames() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/list');
                result = await result.json();
                setGames(result);
            } catch (error) {
                console.error('Error fetching the game list:', error);
            }
        }

        fetchGames();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center">Game List</h1>
                <Row>
                    {games.map((game) => (
                        <Col md={4} key={game.id} className="mb-4">
                            <Card className="game-card">
                                <Card.Img variant="top" src={`http://127.0.0.1:8000/${game.img_path}`} />
                                <Card.Body>     
                            
                                    <Card.Title>{game.name}</Card.Title>
                                    <Card.Text>
                                        
                                    <strong>Platforms:</strong><br />
                                        {game.platforms.map(platform => (
                                            <div className="platform-image" key={platform.id}>
                                                <span>{platform.name}</span>
                                                <img src={`http://127.0.0.1:8000/${platform.image}`} alt={platform.name} />
                                            </div>
                                        ))}
                                        
                                        <strong>Categories:</strong><br />
                                        {game.categories.map(category => (
                                            <div className="platform-image" key={category.id}>
                                                <span>{category.name}</span>
                                                <img src={`http://127.0.0.1:8000/${category.logo}`} alt={category.name} />
                                            </div>
                                        ))}
                                        
                                        
                                    </Card.Text>
                                    <Button variant="danger" href={game.link} target="_blank" rel="noopener noreferrer">
                                        More Info
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default GamesPage;
