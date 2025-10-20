import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/esm/Form';

export default function Login({onLogin}) {
    const [email,setEmail]= useState('');
    const [passward,setPassword]= useState('');
    const [error,setError]=useState('');
    const [user,setUser]=useState([]);
    const fetchUser = async()=> {
        try{
            const response = await axios.get("http://localhost:9999/users");
            setUser(response.data);
        }catch(error){
            console.error("Lỗi khi lấy dữ liệu người dùng.",error);
            setError("Lỗi khi lấy dữ liệu người dùng.")
        }
    }
    const handleSubmit =(event)=>{
        event.preventDefault();


    }
    useEffect(()=>{
        fetchUser();
    },[]);
  return (
    <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2>Đăng nhập</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <Form >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email" value={email} 
                             />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button variant="primary" type="submit">
                                Đăng nhập
                            </Button>
                            <Button variant="secondary" >
                                Đăng ký
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
  )
}
