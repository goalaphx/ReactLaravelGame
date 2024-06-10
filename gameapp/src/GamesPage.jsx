import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './GamePage.css';

function GamesPage() {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/list');
                let data = await response.json();
                setGames(data);
                console.log("Fetched games:", data);

                let platformResponse = await fetch('http://127.0.0.1:8000/api/listplat');
                let platformData = await platformResponse.json();
                setPlatforms(platformData);

                let categoryResponse = await fetch('http://127.0.0.1:8000/api/listcat');
                let categoryData = await categoryResponse.json();
                setCategories(categoryData);
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

    const handleSearch = async (event) => {
        event.preventDefault();
    
        let searchUrl = `http://127.0.0.1:8000/api/search?key=${searchQuery}`;
    
        try {
            let response = await fetch(searchUrl);
            let data = await response.json();
            setGames(data);
            console.log("Searched games:", data);
        } catch (error) {
            console.error('Error searching games:', error);
        }
    };

    const handleFilterByPlatform = async () => {
        if (!selectedPlatform) return;
    
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/filterByPlatform?platform_id=${selectedPlatform}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error filtering games by platform');
            }
            let data = await response.json();
            setGames(data);
            console.log("Filtered games by platform:", data);
        } catch (error) {
            console.error('Error filtering games by platform:', error);
            alert(`Error: ${error.message}`);
        }
    };
    
    const handleFilterByCategory = async () => {
        if (!selectedCategory) return;
    
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/filterByCategory?category_id=${selectedCategory}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error filtering games by category');
            }
            let data = await response.json();
            setGames(data);
            console.log("Filtered games by category:", data);
        } catch (error) {
            console.error('Error filtering games by category:', error);
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Game List</CustomStyledComponent></h1>
                <Form className="mb-4" onSubmit={handleSearch}>
                    <FormGroup className="d-flex">
                        <FormControl
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" variant="outline-success" className="ml-2">
                            <FontAwesomeIcon icon={faSearch} /> Search
                        </Button>
                    </FormGroup>
                </Form>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel>Filter by Platform</FormLabel>
                            <FormControl as="select" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                                <option value="">Select Platform</option>
                                {platforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                                ))}
                            </FormControl>
                            <Button className="mt-2 mb-2" variant="outline-primary" onClick={handleFilterByPlatform}>
                                Filter
                            </Button>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <FormLabel>Filter by Category</FormLabel>
                            <FormControl as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </FormControl>
                            <Button className="mt-2" variant="outline-primary" onClick={handleFilterByCategory}>
                                Filter
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
                {games.length === 0 ? (
                    <h1 className="text-center" style={{ color: 'red', border: '2px solid red', padding: '10px' ,backgroundColor: 'yellow'}}>No Games Found</h1>
                ) : (
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
            )}
            </Container>
        </>
    );
}

export default GamesPage;

