import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Header from './Header';

function UpdateCategory() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                let result = await fetch(`http://127.0.0.1:8000/api/cat/` + id);
                result = await result.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching the category data:', error);
            }
        }

        getData();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        if (event.target.img.files[0]) {
            formData.append('img', event.target.img.files[0]);
        }
        formData.append('name', event.target.name.value);

        try {
            const result = await fetch(`http://127.0.0.1:8000/api/updatecat/` + id, {
                method: 'POST', // Changed to PUT
                body: formData
            });

            if (result.ok) {
                navigate('/listcat'); // Navigate to the correct list page
            } else {
                console.error('Error updating the Category:', result.statusText);
            }
        } catch (error) {
            console.error('Error updating the Category:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Update Category</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={data.name} />
                            </Form.Group>
                        
                            <Form.Group controlId="img" className="my-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="img" />
                                {data.logo && (
                                    <Image
                                        className="my-3"
                                        style={{ width: 120, height: 120 }}
                                        src={`http://127.0.0.1:8000/${data.logo}`}
                                        alt=""
                                        thumbnail
                                    />
                                )}
                            </Form.Group>

                            <Button variant="primary" className="mb-3" type="submit">
                                Update
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default UpdateCategory;
