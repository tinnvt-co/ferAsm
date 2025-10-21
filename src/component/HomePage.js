import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const adImages = ['/banner-cung-cap-si.jpg', '/cơmnhàđủrau.png', '/qc1.jpg'];
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setProducts(data.products);
        setBlogs(data.blogs);
      });
  }, []);

  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => product.categoryId === categoryId).slice(0, 6);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  return (
    <>
      {!isLoggedIn && <Header />}
      <Container className="py-4">
        <Row className="mb-5">
          <Col md={8} className="p-0">
            {!videoEnded ? (
              <video
                ref={videoRef}
                src="/8593075538973253143.mp4"
                className="w-100"
                style={{ height: '350px', objectFit: 'cover' }}
                autoPlay
                muted
                onEnded={() => setVideoEnded(true)}
                controls
              />
            ) : (
              <Carousel className="w-100" indicators={false} controls={true} interval={3000}>
                {adImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`Quảng cáo ${index + 1}`}
                      className="w-100"
                      style={{ height: '350px', objectFit: 'cover', margin: 0, padding: 0 }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Col>
          <Col md={4} className="p-0">
          <Row className="m-0">
              {blogs.slice(0, 3).map((blog, index) => (
                <Col key={blog.id} xs={6} className="p-1">
                  <Card className="border-0 shadow-sm h-100" style={{ height: '175px' }}>
                    <Card.Img variant="top" src={blog.image} alt={blog.title} style={{ height: '115px', objectFit: 'cover' }} />
                    <Card.Body className="d-flex flex-column justify-content-between p-2" style={{ height: '55px' }}>
                      <Card.Title className="fs-6 text-truncate">
                        <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">{blog.title}</Link>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              <Col xs={6} className="d-flex align-items-center justify-content-center p-1">
                <Button variant="success" as={Link} to="/blogs">Xem thêm</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {categories.map((category) => (
          <div key={category.id} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">{category.name}</h4>
              <Link to={`/category/${category.id}`} className="text-dark">Xem thêm</Link>
            </div>
            <Row>
              {getProductsByCategory(category.id).map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: '180px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                    />
                    <Card.Body className="p-2 d-flex flex-column">
                      <Card.Title className="fs-6 text-truncate">
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                      </Card.Title>
                      <Card.Text className="small text-muted flex-grow-1" style={{ minHeight: '36px', overflow: 'hidden' }}>
                        {product.description}
                      </Card.Text>
                      <div className="fw-bold text-primary mb-2">{product.price.toLocaleString()} VND</div>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleAddToCart(product)}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Container>
      <Footer />
    </>
  );
}
