import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    try {
      // Check if email already exists
      const usersResponse = await axios.get("http://localhost:9999/users");
      const userExists = usersResponse.data.some(
        (user) => user.email === email
      );

      if (userExists) {
        setError("Email đã được đăng ký. Vui lòng sử dụng email khác.");
        return;
      }

      // Get the latest user ID to create a new one
      const maxId = Math.max(...usersResponse.data.map((user) => user.id), 0);

      // Create new user
      const newUser = {
        id: maxId + 1,
        name,
        email,
        password, // Note: In a production app, password should be hashed
        role: "customer", // Default role for new users
      };

      await axios.post("http://localhost:9999/users", newUser);

      setSuccess("Đăng ký thành công!");
      // Chuyển hướng ngay lập tức đến trang đăng nhập
      navigate("/login");
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button variant="primary" type="submit">
                Đăng ký
              </Button>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
