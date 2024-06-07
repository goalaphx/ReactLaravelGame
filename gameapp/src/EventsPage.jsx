import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './EventsPage.css'; // Create a CSS file for additional styling

function EventsPage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/events/list');
                result = await result.json();
                setEvents(result);
            } catch (error) {
                console.error('Error fetching the event list:', error);
            }
        }

        fetchEvents();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Events List</CustomStyledComponent></h1>
                <Row>
                    {events.map((event) => (
                        <Col md={6} key={event.id} className="mb-4">
                            <Card className="event-card">
                                <Card.Img variant="top" src={`http://127.0.0.1:8000/${event.logo}`} />
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Description:</strong> {event.description}<br />
                                        <strong>Game:</strong> {event.game ? event.game.name : 'N/A'}
                                    </Card.Text>
                                    <Button variant="danger" href={event.link} target="_blank" rel="noopener noreferrer">
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

export default EventsPage;
