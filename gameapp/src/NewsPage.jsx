import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from './Header';
import './NewsPage.css';

function NewsPage() {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        async function fetchNews() {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/news/${id}`);
                response = await response.json();
                setNews(response);
            } catch (error) {
                console.error('Error fetching the news details:', error);
            }
        }

        fetchNews();
    }, [id]);

    if (!news) {
        return <div>Loading...</div>;
    }

    // Split the content on each full stop
    const paragraphs = news.content.split('.').filter(Boolean);

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center">{news.title}</h1>
                <Card className="news-detail-card">
                    {news.image_path && (
                        <Card.Img variant="top" src={`http://127.0.0.1:8000/${news.image_path}`} />
                    )}
                    <Card.Body>
                        {/* Map over each paragraph and wrap it in a <p> tag */}
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph.trim()}.</p>
                        ))}
                        {news.game && (
                            <div>
                                <strong>Game:</strong> {news.game.name}
                            </div>
                        )}
                        {news.emulator && (
                            <div>
                                <strong>Emulator:</strong> {news.emulator.name}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default NewsPage;
