import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './EmuPage.css'; // import the CSS file

function EmuPage() {
    const [emulators, setEmulators] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        async function fetchEmu() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/listemu');
                result = await result.json();
                setEmulators(result);
            } catch (error) {
                console.error('Error fetching the emulator list:', error);
            }
        }

        async function fetchFavorites() {
            const userInfo = JSON.parse(localStorage.getItem('user-info'));
            if (userInfo) {
                try {
                    let response = await fetch(`http://127.0.0.1:8000/api/favorites?user_id=${userInfo.id}`);
                    let data = await response.json();
                    setFavorites(data);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        }

        // Load favorites from local storage if available
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);

        fetchEmu();
        fetchFavorites();
    }, []);

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
            setFavorites([...favorites, { id: emuId }]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    }

    const isFavorite = (id) => favorites.some(fav => fav.id === id);

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Emulator List</CustomStyledComponent></h1>
                <Row>
                    {emulators.map((emu) => (
                        <Col md={4} key={emu.id} className="mb-4">
                            <Card className="emu-card">
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
                                        {
                                            !isFavorite(emu.id) && (
                                                <Button variant="primary" onClick={() => handleAddFavorite(emu.id)}>
                                                    <FontAwesomeIcon icon={faHeart} />
                                                </Button>
                                            )
                                        }
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
