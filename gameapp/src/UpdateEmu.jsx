import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Header from './Header';
import { MultiSelect } from 'react-multi-select-component';

function UpdateEmu() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                let result = await fetch(`http://127.0.0.1:8000/api/emu/` + id);
                result = await result.json();
                setData(result);
                setSelectedPlatforms(result.platforms.map(platform => ({ label: platform.name, value: platform.id })));
            } catch (error) {
                console.error('Error fetching the emulator data:', error);
            }
        }
    
        async function fetchPlatforms() {
            try {
                let result = await fetch('http://127.0.0.1:8000/api/listplat');
                result = await result.json();
                setPlatforms(result.map(platform => ({ label: platform.name, value: platform.id })));
            } catch (error) {
                console.error('Error fetching the platforms list:', error);
            }
        }
    
        getData();
        fetchPlatforms();
    }, [id]);
    

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        if (event.target.img.files[0]) {
            formData.append('img', event.target.img.files[0]);
        }
        formData.append('name', event.target.name.value);
        formData.append('description', event.target.description.value);
        formData.append('link', event.target.link.value);
        formData.append('platforms', JSON.stringify(selectedPlatforms.map(platform => platform.value))); // Append platforms as JSON string

        try {
            const result = await fetch(`http://127.0.0.1:8000/api/updateemu/` + id, {
                method: 'POST',
                body: formData
            });

            if (result.ok) {
                navigate('/listemu');
            } else {
                console.error('Error updating the emulator:', result.statusText);
            }
        } catch (error) {
            console.error('Error updating the emulator:', error);
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-center">
                    <Col sm={8}>
                        <h1 className="my-4 text-center">Update Emulator</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={data.name} />
                            </Form.Group>

                            <Form.Group controlId="platforms" className="my-3">
                                <Form.Label>Platforms</Form.Label>
                                <MultiSelect
                                    options={platforms}
                                    value={selectedPlatforms}
                                    onChange={setSelectedPlatforms}
                                    labelledBy="Select Platforms"
                                />
                            </Form.Group>

                            <Form.Group controlId="img" className="my-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="img" />
                                {data.image && (
                                    <Image
                                        className="my-3"
                                        style={{ width: 120, height: 120 }}
                                        src={`http://127.0.0.1:8000/${data.image}`}
                                        alt=""
                                        thumbnail
                                    />
                                )}
                            </Form.Group>

                            <Form.Group controlId="description" className="my-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} defaultValue={data.description} />
                            </Form.Group>

                            <Form.Group controlId="link" className="my-3">
                                <Form.Label>Link</Form.Label>
                                <Form.Control type="text" defaultValue={data.link} />
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

export default UpdateEmu;
