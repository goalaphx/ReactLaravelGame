import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './GamePage.css';

function GamesPage() {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/list');
                let data = await response.json();
                setGames(data);
                console.log("Fetched games:", data);
            } catch (error) {
                console.error('Error fetching the game list:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchFavorites() {
            const userInfo = JSON.parse(localStorage.getItem('user-info'));

            if (!userInfo) {
                return;
            }

            try {
                let response = await fetch(`http://127.0.0.1:8000/api/favorites?user_id=${userInfo.id}`);
                let data = await response.json();
                setFavorites(data);
                console.log("Fetched favorites:", data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        }

        fetchFavorites();
    }, []);

    const isFavorite = (gameId) => {
        const result = favorites.some(favorite => favorite.game_id === gameId);
        console.log(`Game ID ${gameId} is favorite:`, result);
        return result;
    };

    async function handleAddFavorite(gameId) {
        const userInfo = JSON.parse(localStorage.getItem('user-info'));

        if (!userInfo) {
            alert('Please login to add favorites');
            return;
        }

        try {
            await fetch('http://127.0.0.1:8000/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ game_id: gameId, user_id: userInfo.id })
            });
            alert('Added to favorites');
            setFavorites(prevFavorites => [...prevFavorites, { game_id: gameId }]);
            console.log("Updated favorites after adding:", [...favorites, { game_id: gameId }]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Game List</CustomStyledComponent></h1>
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
                                    <div className="btn-container">
                                        <Button variant="danger" href={game.link} target="_blank" rel="noopener noreferrer">
                                            More Info
                                        </Button>
                                        {!isFavorite(game.id) && (
                                            <Button variant="primary" onClick={() => handleAddFavorite(game.id)}>
                                                <FontAwesomeIcon icon={faHeart} />
                                            </Button>
                                        )}
                                    </div>
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
