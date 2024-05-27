import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function GameList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function deleteOperation(id) {
        let result = await fetch("http://127.0.0.1:8000/api/delete/" + id, {
            method: 'DELETE'
        });
        if (result.ok) {
            alert("Game has been deleted");
            getData();
        } else {
            alert("Error deleting game");
        }
    }

    async function getData() {
        let result = await fetch('http://127.0.0.1:8000/api/list');
        result = await result.json();
        setData(result);
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Game List</h1>
                        <div className="text-center mb-3">
                            <Link to="/addgame">
                                <Button variant="success outline-light">Add Game</Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Platforms</th>
                                    <th>Categories</th>
                                    <th>Image</th>
                                    <th>Link</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            {item.platforms.map(platform => (
                                                <div key={platform.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img src={`http://127.0.0.1:8000/${platform.image}`} alt="" style={{ width: 30, height: 30, marginRight: 5 }} />
                                                    {platform.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {item.categories.map(category => (
                                                <div key={category.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img src={`http://127.0.0.1:8000/${category.logo}`} alt="" style={{ width: 30, height: 30, marginRight: 5 }} />
                                                    {category.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td><img style={{ width: 50, height: 50 }} src={"http://127.0.0.1:8000/" + item.img_path} alt="" /></td>
                                        <td><a href={item.link} target="_blank" rel="noopener noreferrer">Link</a></td>
                                        <td>
                                            <Button variant="danger" onClick={() => deleteOperation(item.id)} className="m-1">Delete</Button>
                                            <Link to={"/update/" + item.id}>
                                                <Button variant="info" className="m-1">Update</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default GameList;
