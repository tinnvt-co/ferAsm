import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Quên mật khẩu
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotEmailSuccess, setForgotEmailSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [processingReset, setProcessingReset] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:9999/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", err);
        setError("Lỗi khi lấy dữ liệu người dùng.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    ); // Cần mã hóa mật khẩu

    if (user) {
      // Use login function from AuthContext
      login(user);
      navigate("/");
    } else {
      setError("Email hoặc mật khẩu không đúng.");
    }
  };

  // Xử lý kiểm tra email quên mật khẩu
  const handleCheckEmail = (e) => {
    e.preventDefault();
    setForgotEmailError("");

    if (!forgotEmail) {
      setForgotEmailError("Vui lòng nhập email.");
      return;
    }

    const user = users.find((u) => u.email === forgotEmail);

    if (!user) {
      setForgotEmailError("Email không tồn tại trong hệ thống.");
      return;
    }

    setForgotEmailSuccess(true);
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setProcessingReset(true);

    // Validate mật khẩu
    if (!newPassword || !confirmPassword) {
      setForgotPasswordError("Vui lòng nhập đầy đủ thông tin.");
      setProcessingReset(false);
      return;
    }

    if (newPassword.length < 6) {
      setForgotPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      setProcessingReset(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Mật khẩu xác nhận không khớp.");
      setProcessingReset(false);
      return;
    }

    try {
      const user = users.find((u) => u.email === forgotEmail);

      if (user) {
        const updatedUser = { ...user, password: newPassword };
        await axios.put(`http://localhost:9999/users/${user.id}`, updatedUser);

        // Reset form và đóng modal
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotEmailSuccess(false);
        setShowForgotPassword(false);
        setSuccess(
          "Mật khẩu đã được cập nhật. Vui lòng đăng nhập bằng mật khẩu mới."
        );
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật mật khẩu:", err);
      setForgotPasswordError("Có lỗi xảy ra khi cập nhật mật khẩu.");
    }

    setProcessingReset(false);
  };

  // Xử lý đóng modal quên mật khẩu
  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotEmailError("");
    setForgotPasswordError("");
    setForgotEmailSuccess(false);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Đăng nhập</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-end mt-1">
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Quên mật khẩu?
                  </Button>
                </div>
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button variant="primary" type="submit">
                  Đăng nhập
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký tài khoản mới
                </Button>
              </div>
            </Form>
          )}
        </Col>
      </Row>

      {/* Modal quên mật khẩu */}
      <Modal show={showForgotPassword} onHide={handleCloseForgotPassword}>
        <Modal.Header closeButton>
          <Modal.Title>Quên mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!forgotEmailSuccess ? (
            <Form onSubmit={handleCheckEmail}>
              <p>Nhập email của bạn để đặt lại mật khẩu.</p>
              {forgotEmailError && (
                <Alert variant="danger">{forgotEmailError}</Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Tiếp tục
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleResetPassword}>
              <p>Vui lòng nhập mật khẩu mới.</p>
              {forgotPasswordError && (
                <Alert variant="danger">{forgotPasswordError}</Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Mật khẩu phải có ít nhất 6 ký tự.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={processingReset}
                >
                  {processingReset ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Login;
