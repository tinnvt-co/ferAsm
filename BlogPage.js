import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs);
      });
  }, []);

  return (
    <>
      <Header />
      <Container className="py-4">
        <h2 className="mb-4">Danh sách Bài viết</h2>
        <Row>
          {blogs.map((blog) => (
            <Col key={blog.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Img variant="top" src={blog.image} alt={blog.title} style={{ height: '180px', objectFit: 'cover' }} />
                <Card.Body className="p-2 d-flex flex-column">
                  <Card.Title className="fs-6 text-truncate">
                    <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">{blog.title}</Link>
                  </Card.Title>
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
