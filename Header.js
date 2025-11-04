import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Cart } from 'react-bootstrap-icons';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
    
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">GreenBasket</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
          <Dropdown>
  <Dropdown.Toggle variant="success">Danh mục</Dropdown.Toggle>
  <Dropdown.Menu>
    {categories.map((category) => (
      <Dropdown.Item as={Link} to={`/category/${category.id}`} key={category.id}>
        {category.name}
      </Dropdown.Item>
    ))}
    <Dropdown.Divider />
    <Dropdown.Item as={Link} to="/products" className="fw-bold text-success">
      Tất cả
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
          </Nav>

          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="outline-success">Tìm</Button>
          </Form>

          <Nav className="ms-auto align-items-center">
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/orders">Đơn Hàng</Nav.Link>
                <Nav.Link as={Link} to="/reviews">Đánh Giá</Nav.Link>
                <Nav.Link as={Link} to="/profile" className="fw-bold">Thông tin của tôi</Nav.Link>
                <Button as={Link} to="/cart" variant="outline-primary" className="ms-2">
                  <Cart size={20} />
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
