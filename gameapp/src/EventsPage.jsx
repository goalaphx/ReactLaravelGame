import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './EventsPage.css';

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            let result = await fetch('http://127.0.0.1:8000/api/events/list');
            result = await result.json();
            setEvents(result);
            console.log("Fetched events:", result);
        } catch (error) {
            console.error('Error fetching the event list:', error);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
    
        if (!searchQuery.trim()) {
            fetchEvents();
            return;
        }

        let searchUrl = `http://127.0.0.1:8000/api/events/search/${searchQuery}`;
    
        try {
            let response = await fetch(searchUrl);
            let data = await response.json();
            setEvents(data);
            console.log("Searched events:", data);
        } catch (error) {
            console.error('Error searching events:', error);
        }
    };

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Events List</CustomStyledComponent></h1>
                <Form className="mb-4" onSubmit={handleSearch}>
                    <FormGroup>
                        <FormLabel>Search Query</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Search by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </FormGroup>
                    <Button className="mt-4" type="submit" variant="outline-success">
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </Button>
                </Form>
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
