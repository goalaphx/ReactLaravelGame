import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import Header from './Header';
import './FavoritesPage.css';
import { CustomStyledComponent } from './App';

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        async function fetchFavorites() {
            const userInfo = JSON.parse(localStorage.getItem('user-info'));

            if (!userInfo) {
                alert('Please login to view favorites');
                return;
            }

            try {
                let response = await fetch(`http://127.0.0.1:8000/api/favorites?user_id=${userInfo.id}`);
                let data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        }

        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (id) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/favorites/${id}`, {
                method: 'DELETE'
            });
            // Update favorites list after removal
            setFavorites(favorites.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <>
            <Header />
            <Container>
                <h1 className="my-4 text-center"><CustomStyledComponent>Your Favorites</CustomStyledComponent></h1>
                <div className="favorites-container">
                    {favorites.length === 0 ? (
                        <div className="no-items-message">No items here</div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favorites.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td className="image-container"><img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} /></td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveFavorite(item.id)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Container>
        </>
    );
}

export default FavoritesPage;
