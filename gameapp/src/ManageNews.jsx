import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './ManageNews.css'; // Create a CSS file for additional styling

function ManageNews() {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchNews() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/news/list');
                result = await result.json();
                setNews(result);
            } catch (error) {
                console.error('Error fetching the news list:', error);
            }
        }

        fetchNews();
    }, []);

    const handleEdit = (id) => {
        navigate(`/news/update/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/news/delete/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setNews(news.filter(item => item.id !== id));
                } else {
                    console.error('Error deleting the news:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting the news:', error);
            }
        }
    };

    const handleAddNews = () => {
        navigate('/news/add');
    };

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center">Manage News</h1>
                <div className="text-end mb-4">
                    <Button variant="success" onClick={handleAddNews}>
                        Add News
                    </Button>
                </div>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {news.map((item) => (
                        <Col key={item.id}>
                            <Card className="news-card">
                                {item.image_path && (
                                    <Card.Img variant="top" src={`http://127.0.0.1:8000/${item.image_path}`} />
                                )}
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>
                                        {item.content.substring(0, 100)}...
                                        <div className="info">
                                            <strong>Game:</strong> {item.game ? item.game.name : 'None'}
                                        </div>
                                        <div className="info">
                                            <strong>Emulator:</strong> {item.emulator ? item.emulator.name : 'None'}
                                        </div>
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => handleEdit(item.id)} className="me-2 mb-2">
                                        Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(item.id)} className="me-2 mb-2">
                                        Delete
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

export default ManageNews;
