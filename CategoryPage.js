import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Container, Form } from 'react-bootstrap';
import Header from "./Header"
import Footer from "./Footer"
import { useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceCategory, setPriceCategory] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    const fetchData = async () => {
      try {
        const res = await fetch('/database.json');
        const db = await res.json();
        const cat = db.categories.find((c) => c.id === parseInt(id));
        const prods = db.products.filter((p) => p.categoryId === parseInt(id));
        setCategory(cat);
        setProducts(prods);
        setFilteredProducts(prods);

        const randomBlogs = db.blogs.sort(() => 0.5 - Math.random()).slice(0, 2);
        setBlogs(randomBlogs);

        const otherProducts = db.products.filter((p) => p.categoryId !== parseInt(id));
        setRelatedProducts(otherProducts.sort(() => 0.5 - Math.random()).slice(0, 6));
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let filtered = products.filter((p) => {
      return (
        (!minPrice || p.price >= parseFloat(minPrice)) &&
        (!maxPrice || p.price <= parseFloat(maxPrice))
      );
    });

    if (priceCategory) {
      switch (priceCategory) {
        case 'low':
          filtered = filtered.filter((p) => p.price < 20000);
          break;
        case 'medium':
          filtered = filtered.filter((p) => p.price >= 20000 && p.price <= 50000);
          break;
        case 'high':
          filtered = filtered.filter((p) => p.price > 50000 && p.price <= 100000);
          break;
        case 'premium':
          filtered = filtered.filter((p) => p.price > 100000);
          break;
        default:
          break;
      }
    }
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, priceCategory, products]);

  if (!category) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <>
      {!isLoggedIn && <Header />}
      <Container className="py-4">
        <Row>
          {/* Bộ lọc giá bên trái */}
          <Col md={3}>
            <h4 className="fw-bold">Lọc theo giá</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Khoảng giá</Form.Label>
                <Form.Select value={priceCategory} onChange={(e) => setPriceCategory(e.target.value)}>
                  <option value="">Chọn phân loại giá</option>
                  <option value="low">Giá rẻ (Dưới 20.000đ)</option>
                  <option value="medium">Trung bình (20.000đ - 50.000đ)</option>
                  <option value="high">Cao cấp (50.000đ - 100.000đ)</option>
                  <option value="premium">Trên 100.000đ</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá tối thiểu (nghìn đồng)</Form.Label>
                <Form.Control
                  type="number"
                  value={minPrice / 1000}
                  onChange={(e) => setMinPrice(Math.max(1000, e.target.value * 1000))}
                  placeholder="1"
                  min="1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giá tối đa (nghìn đồng)</Form.Label>
                <Form.Control
                  type="number"
                  value={maxPrice / 1000}
                  onChange={(e) => setMaxPrice(e.target.value * 1000)}
                  placeholder="Không giới hạn"
                  min="1"
                />
              </Form.Group>
            </Form>
          </Col>

          {/* Danh sách sản phẩm */}
          <Col md={6}>
            <h2 className="fw-bold mb-4">{category.name}</h2>
            {filteredProducts.length === 0 ? (
              <p className="text-center text-muted">Không có sản phẩm nào trong danh mục này.</p>
            ) : (
              <Row>
                {filteredProducts.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Img 
                        variant="top" 
                        src={product.image} 
                        alt={product.name} 
                        style={{ height: '200px', objectFit: 'cover' }} 
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="text-truncate">
                          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                        </Card.Title>
                        <Card.Text className="text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
                          {product.description}
                        </Card.Text>
                        <Card.Text className="fw-bold text-primary">{product.price.toLocaleString()} VND</Card.Text>
                        <Button variant="success" className="w-100 mt-auto">Thêm vào giỏ</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
          {/* Blog bên phải */}
          <Col md={3}>
            <h4 className="fw-bold">Bài viết nổi bật</h4>
            {blogs.map((blog) => (
              <Card key={blog.id} className="mb-3 shadow-sm">
                <Card.Img variant="top" src={blog.image} alt={blog.title} />
                <Card.Body>
                  <Card.Title className="text-truncate">
                    <Link to={blog.link} className="text-decoration-none text-dark">{blog.title}</Link>
                  </Card.Title>
                  <Card.Text className="text-muted small">{blog.excerpt}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        {/* Sản phẩm liên quan */}
        <Row className="mt-5 d-flex align-items-center justify-content-between">
          <Col md={10}>
            <h4 className="fw-bold">Bạn có thể sẽ muốn mua</h4>
          </Col>
          <Col md={2} className="text-end">
            <Button variant="outline-success" onClick={() => navigate('/products')}>Xem thêm</Button>
          </Col>
          {relatedProducts.map((product) => (
            <Col key={product.id} md={2} className="mb-3">
              <Card className="shadow-sm">
                <Card.Img variant="top" src={product.image} alt={product.name} style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="text-truncate">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                  </Card.Title>
                  <Card.Text className="text-primary">{product.price.toLocaleString()} VND</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
}
