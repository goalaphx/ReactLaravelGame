import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { CustomStyledComponent } from './App';
import './ListNews.css';

function ListNews() {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchNews() {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/news/list');
                response = await response.json();
                setNews(response);
            } catch (error) {
                console.error('Error fetching the news list:', error);
            }
        }

        fetchNews();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/news/${id}`);
    };

    // Function to format the date and time
    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString(); // Adjust the format as needed
    };

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Latest News</CustomStyledComponent></h1>
                {news.map((item) => (
                    <Card className="news-card mb-4" key={item.id}>
                        <Row noGutters>
                            {item.image_path && (
                                <Col md={4}>
                                    <Card.Img src={`http://127.0.0.1:8000/${item.image_path}`} alt={item.title} />
                                </Col>
                            )}
                            <Col md={item.image_path ? 8 : 12}>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.content.substring(0, 200)}...</Card.Text>
                                    <div className="news-details">
                                        <p className="news-date">Created: {formatDate(item.created_at)}</p>
                                        <p className="news-date">Updated: {formatDate(item.updated_at)}</p>
                                        {item.game && (
                                            <p>
                                                <strong>Game:</strong> {item.game.name}
                                            </p>
                                        )}
                                        {item.emulator && (
                                            <p>
                                                <strong>Emulator:</strong> {item.emulator.name}
                                            </p>
                                        )}
                                        <Button variant="primary" onClick={() => handleCardClick(item.id)}>Read More</Button>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Container>
        </>
    );
}

export default ListNews;
