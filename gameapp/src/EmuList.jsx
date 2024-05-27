import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EmuList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function deleteOperation(id) {
        let result = await fetch("http://127.0.0.1:8000/api/deleteemu/" + id, {
            method: 'DELETE'
        });
        result = await result.json();
        console.warn(result);
        getData();
    }

    async function getData() {
        let result = await fetch('http://127.0.0.1:8000/api/listemu');
        result = await result.json();
        setData(result);
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Emulator List</h1>
                        <div className="text-center mb-3">
                            <Link to="/addemu">
                                <Button variant="success outline-light"><Link to="/addemu">Add Emulator</Link></Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Platforms</th>
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
                                                <div key={platform.id}>{platform.name}</div>
                                            ))}
                                        </td>
                                        <td><img style={{ width: 120, height: 120 }} src={"http://127.0.0.1:8000/" + item.image} alt="" /></td>
                                        <td><a href={item.link} target="_blank" rel="noopener noreferrer">Link</a></td>
                                        <td>
                                            <Button variant="danger" onClick={() => deleteOperation(item.id)} className="m-1">Delete</Button>
                                            <Link to={"/updateemu/" + item.id}>
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

export default EmuList;
