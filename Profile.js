import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Nav,
  Badge,
} from "react-bootstrap";
import { useAuth } from "./context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const Profile = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile update state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Check if email exists
      if (profileData.email !== user.email) {
        const usersResponse = await axios.get("http://localhost:9999/users");
        const emailExists = usersResponse.data.some(
          (u) => u.email === profileData.email && u.id !== user.id
        );

        if (emailExists) {
          setError("Email đã tồn tại trong hệ thống.");
          setLoading(false);
          return;
        }
      }

      // Update user information
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
      };

      const response = await axios.put(
        `http://localhost:9999/users/${user.id}`,
        updatedUser
      );

      // Update the user in context and localStorage
      login(response.data);

      setSuccess("Thông tin đã được cập nhật thành công.");
      setLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Có lỗi xảy ra khi cập nhật thông tin.");
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate current password
    if (passwordData.currentPassword !== user.password) {
      setError("Mật khẩu hiện tại không đúng.");
      setLoading(false);
      return;
    }

    // Validate new password
    if (passwordData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    // Validate confirm password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      // Update user password
      const updatedUser = {
        ...user,
        password: passwordData.newPassword,
      };

      const response = await axios.put(
        `http://localhost:9999/users/${user.id}`,
        updatedUser
      );

      // Update the user in context and localStorage
      login(response.data);

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Mật khẩu đã được cập nhật thành công.");
      setLoading(false);
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Có lỗi xảy ra khi cập nhật mật khẩu.");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Thông tin tài khoản</h2>
          <Badge
            bg={
              user?.role === "admin"
                ? "danger"
                : user?.role === "sale"
                ? "warning"
                : "success"
            }
            className="fs-6 px-3 py-2"
          >
            {user?.role === "admin"
              ? "Quản trị viên"
              : user?.role === "sale"
              ? "Nhân viên bán hàng"
              : "Khách hàng"}
          </Badge>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col md={3}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-4">
                  <div
                    className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i
                      className="bi bi-person-circle text-primary"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h5 className="mb-1">{user?.name}</h5>
                  <p className="text-muted small mb-3">{user?.email}</p>
                  <div className="d-grid">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setActiveTab("info")}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Nav
                variant="pills"
                className="flex-column bg-white shadow-sm rounded"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="info"
                    className={
                      activeTab === "info" ? "text-white" : "text-dark"
                    }
                  >
                    <i className="bi bi-person-fill me-2"></i>
                    Thông tin cá nhân
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="password"
                    className={
                      activeTab === "password" ? "text-white" : "text-dark"
                    }
                  >
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Đổi mật khẩu
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="orders"
                    className={
                      activeTab === "orders" ? "text-white" : "text-dark"
                    }
                  >
                    <i className="bi bi-bag-fill me-2"></i>
                    Lịch sử đơn hàng
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {user?.role === "admin" && (
                <div className="mt-4 d-grid">
                  <Button
                    variant="danger"
                    as="a"
                    href="/admin"
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-gear-fill me-2"></i>
                    Trang quản trị
                  </Button>
                </div>
              )}
            </Col>
            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">Thông tin cá nhân</h4>
                      {error && <Alert variant="danger">{error}</Alert>}
                      {success && <Alert variant="success">{success}</Alert>}

                      <Form onSubmit={handleProfileUpdate}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Vai trò</Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              user?.role === "admin"
                                ? "Quản trị viên"
                                : user?.role === "sale"
                                ? "Nhân viên bán hàng"
                                : "Khách hàng"
                            }
                            readOnly
                            disabled
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading}
                          className="mt-2"
                        >
                          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="password">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">Đổi mật khẩu</h4>
                      {error && <Alert variant="danger">{error}</Alert>}
                      {success && <Alert variant="success">{success}</Alert>}

                      <Form onSubmit={handlePasswordUpdate}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mật khẩu hiện tại</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Mật khẩu mới</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
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
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading}
                          className="mt-2"
                        >
                          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="orders">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">Lịch sử đơn hàng</h4>
                      <div className="text-center py-5">
                        <i
                          className="bi bi-bag text-muted"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <p className="text-muted mt-3">
                          Chức năng đang được phát triển...
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
