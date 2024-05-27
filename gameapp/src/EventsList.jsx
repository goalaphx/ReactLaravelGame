import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EventsList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function deleteOperation(id) {
        let result = await fetch(`http://127.0.0.1:8000/api/events/delete/${id}`, {
            method: 'DELETE'
        });
        if (result.ok) {
            alert("Event has been deleted");
            getData();
        } else {
            alert("Error deleting event");
        }
    }

    async function getData() {
        let result = await fetch('http://127.0.0.1:8000/api/events/list');
        result = await result.json();
        setData(result);
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Events List</h1>
                        <div className="text-center mb-3">
                            <Link to="/addevent">
                                <Button variant="success outline-light">Add Event</Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Game</th>
                                    <th>Logo</th>
                                    <th>Link</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.game ? item.game.name : 'N/A'}</td>
                                        <td><img style={{ width: 50, height: 50 }} src={"http://127.0.0.1:8000/" + item.logo} alt="" /></td>
                                        <td><a href={item.link} target="_blank" rel="noopener noreferrer">Link</a></td>
                                        <td>
                                            <Button variant="danger" onClick={() => deleteOperation(item.id)} className="m-1">Delete</Button>
                                            <Link to={"/updateevent/" + item.id}>
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

export default EventsList;
