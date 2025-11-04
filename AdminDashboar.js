import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import UserManagement from "./admin/UserManagement";
import AdminWelcome from "./admin/AdminWelcome";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [showWelcome, setShowWelcome] = useState(true);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("admin_visited");
    if (hasVisitedBefore) {
      setShowWelcome(false);
      setActiveTab("users");
    } else {
      setShowWelcome(true);
      setActiveTab("welcome");
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("admin_visited", "true");
    setShowWelcome(false);
    setActiveTab("users");
  };

  return (
    <>
      <Header />
      <Container className="py-4">
        <h2 className="mb-4">Bảng điều khiển quản trị</h2>

        {showWelcome ? (
          <AdminWelcome onGetStarted={handleGetStarted} />
        ) : (
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="users">
                      <i className="bi bi-people-fill me-2"></i>Quản lý người
                      dùng
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products">
                      <i className="bi bi-box-seam-fill me-2"></i>Quản lý sản
                      phẩm
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="categories">
                      <i className="bi bi-tags-fill me-2"></i>Quản lý danh mục
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">
                      <i className="bi bi-cart-check-fill me-2"></i>Quản lý đơn
                      hàng
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="blogs">
                      <i className="bi bi-file-richtext-fill me-2"></i>Quản lý
                      bài viết
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="users">
                    <UserManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="products">
                    <h3>Quản lý sản phẩm</h3>
                    <p>Chức năng đang được phát triển...</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="categories">
                    <h3>Quản lý danh mục</h3>
                    <p>Chức năng đang được phát triển...</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="orders">
                    <h3>Quản lý đơn hàng</h3>
                    <p>Chức năng đang được phát triển...</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="blogs">
                    <h3>Quản lý bài viết</h3>
                    <p>Chức năng đang được phát triển...</p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default AdminDashboard;
