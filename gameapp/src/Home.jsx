import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import './Home.css'; // Import the CSS file

function Home() {
    return (
        <>
            <Header />
            <div className="hero-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1 className="hero-title">Welcome to GameHub</h1>
                            <p className="hero-subtitle">
                                Your ultimate destination for games, news, emulators, and events.
                            </p>
                            <p><strong>Explore our Different Sections, so you can always be updated on the latest changes in the Gaming World</strong></p>
                        </Col>
                        <Col md={6}>
                            <img
                                src="https://nypost.com/wp-content/uploads/sites/2/2019/03/hd-game-found.jpg?quality=75&strip=all" // Ensure it's a square image
                                alt="Gaming"
                                className="img-fluid hero-image"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container className="sections">
                <Row className="my-5 text-center">
                    <Col md={6} className="section">
                        <img
                            src="https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg"
                            alt="Games"
                            className="img-fluid mb-3"
                        />
                        <h2>Games</h2>
                        <p>Discover a variety of games across different genres and platforms.</p>
                        <Button variant="primary" href="/games">Check Games</Button>
                    </Col>
                    <Col md={6} className="section">
                        <img
                            src="https://t4.ftcdn.net/jpg/03/18/27/83/360_F_318278322_5XZE9O10xz8mpundHqGBDzukYfw9HOoD.jpg"
                            alt="News"
                            className="img-fluid mb-3"
                        />
                        <h2>News</h2>
                        <p>Stay updated with the latest gaming news and trends.</p>
                        <Button variant="primary" href="/news">Read News</Button>
                    </Col>
                </Row>
                <Row className="my-5 text-center">
                    <Col md={6} className="section">
                        <img
                            src="https://fantasyanime.com/emuhelp/images0218/intro-video-game-emulators-2022.jpg"
                            alt="Emulators"
                            className="img-fluid mb-3"
                        />
                        <h2>Emulators</h2>
                        <p>Explore the best emulators to relive classic gaming experiences.</p>
                        <Button variant="primary" href="/emus">Discover Emulators</Button>
                    </Col>
                    <Col md={6} className="section">
                        <img
                            src="https://cloudfront-us-east-1.images.arcpublishing.com/infobae/SHWAOVU65FD2BBKMGK5OB673Y4.jpg"
                            alt="Events"
                            className="img-fluid mb-3"
                        />
                        <h2>Events</h2>
                        <p>Find out about upcoming gaming events and tournaments.</p>
                        <Button variant="primary" href="/events">View Events</Button>
                    </Col>
                </Row>
            </Container>
            
        </>
    );
}

export default Home;
