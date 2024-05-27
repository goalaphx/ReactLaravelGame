import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import './GamePage.css'; // import the CSS file

function EmuPage() {
    const [emulators, setEmu] = useState([]);

    useEffect(() => {
        async function fetchEmu() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/listemu');
                result = await result.json();
                setEmu(result);
            } catch (error) {
                console.error('Error fetching the emu list:', error);
            }
        }

        fetchEmu();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center">Emulator List</h1>
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
                                    <Button variant="danger" href={emu.link} target="_blank" rel="noopener noreferrer">
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

export default EmuPage;
