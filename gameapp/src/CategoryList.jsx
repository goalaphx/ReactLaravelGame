import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CategoryList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function deleteOperation(id) {
        try {
            let result = await fetch(`http://127.0.0.1:8000/api/deletecat/${id}`, {
                method: 'DELETE'
            });
            result = await result.json();
            console.warn(result);
            getData();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    }

    async function getData() {
        try {
            let result = await fetch('http://127.0.0.1:8000/api/listcat');
            result = await result.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Category List</h1>
                        <div className="text-center mb-3">
                            <Link to="/addcat">
                                <Button variant="success">Add Category</Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td><img style={{ width: 120, height: 120 }} src={`http://127.0.0.1:8000/${item.logo}`} alt="" /></td>
                                        <td>
                                            <Button variant="danger" onClick={() => deleteOperation(item.id)} className="m-1">Delete</Button>
                                            <Link to={`/updatecat/${item.id}`}>
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

export default CategoryList;
