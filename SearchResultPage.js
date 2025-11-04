import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from "./Header"

export default function SearchResultsPage() {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      });
  }, []);
  useEffect(() => {
    if (query) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  return (
    <>
      <Header />
      <Container className="py-4">
        <h2 className="fw-bold">Kết quả tìm kiếm cho: "{query}"</h2>

        {filteredProducts.length > 0 ? (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={product.image} alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                    </Card.Title>
                    <Card.Text className="text-muted" style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.description}
                    </Card.Text>
                    <Card.Text className="fw-bold text-primary">{product.price.toLocaleString()} VND</Card.Text>
                    <Button variant="primary" className="w-100">Thêm vào giỏ</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">Không có sản phẩm phù hợp với từ khóa: "{query}"</p>
        )}
      </Container>
    </>
  );
}
