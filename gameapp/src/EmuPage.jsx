import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './EmuPage.css';

function EmuPage() {
    const [emulators, setEmulators] = useState([]);
    const [platforms, setPlatforms] = useState([]); // State to store platforms
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(''); // State for selected platform

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/listemu');
                let data = await response.json();
                setEmulators(data);
                console.log("Fetched emulators:", data);
            } catch (error) {
                console.error('Error fetching the emulator list:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchPlatforms() {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/listplat');
                let data = await response.json();
                setPlatforms(data);
                console.log("Fetched platforms:", data);
            } catch (error) {
                console.error('Error fetching the platform list:', error);
            }
        }

        fetchPlatforms();
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

    const isFavorite = (emuId) => {
        const result = favorites.some(favorite => favorite.emulator_id === emuId);
        console.log(`Emulator ID ${emuId} is favorite:`, result);
        return result;
    };

    async function handleAddFavorite(emuId) {
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
                body: JSON.stringify({ emulator_id: emuId, user_id: userInfo.id })
            });
            alert('Added to favorites');
            setFavorites(prevFavorites => [...prevFavorites, { emulator_id: emuId }]);
            console.log("Updated favorites after adding:", [...favorites, { emulator_id: emuId }]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }

    const handleSearch = async (event) => {
        event.preventDefault();
    
        let searchUrl = `http://127.0.0.1:8000/api/searchemu?key=${searchQuery}`;
        if (selectedPlatform) {
            searchUrl += `&platform_id=${selectedPlatform}`;
        }
    
        try {
            let response = await fetch(searchUrl);
            let data = await response.json();
            setEmulators(data);
            console.log("Searched emulators:", data);
        } catch (error) {
            console.error('Error searching emulators:', error);
        }
    };

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Emulator List</CustomStyledComponent></h1>
                <Form className="mb-4" onSubmit={handleSearch}>
                    <FormGroup>
                        <FormLabel>Search Emulator</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Filter by Platform</FormLabel>
                        <FormControl
                            as="select"
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                        >
                            <option value="">All Platforms</option>
                            {platforms.map((platform) => (
                                <option key={platform.id} value={platform.id}>{platform.name}</option>
                            ))}
                        </FormControl>
                    </FormGroup>
                    <Button className="mt-4" type="submit" variant="outline-success">
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </Button>
                </Form>
                <Row>
                    {emulators.map((emu) => (
                        <Col md={4} key={emu.id} className="mb-4">
                            <Card className="game-card">
                                <Card.Img variant="top" src={`http://127.0.0.1:8000/${emu.image}`} />
                                <Card.Body>
                                    <Card.Title>{emu.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Platforms:</strong><br />
                                        {emu.platforms.map(platform => (
                                            <div className="platform-image" key={platform.id}>
                                                <span>{platform.name}</span>
                                                <img src={`http://127.0.0.1:8000/${platform.image}`} alt={platform.name} />
                                            </div>
                                        ))}
                                    </Card.Text>
                                    <div className="btn-container">
                                        <Button variant="danger" href={emu.link} target="_blank" rel="noopener noreferrer">
                                            More Info
                                        </Button>
                                        {!isFavorite(emu.id) && (
                                            <Button variant="primary" onClick={() => handleAddFavorite(emu.id)}>
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

export default EmuPage;
