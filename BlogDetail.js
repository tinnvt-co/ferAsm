import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        const foundBlog = data.blogs.find((b) => b.id === parseInt(id));
        setBlog(foundBlog);
      });
  }, [id]);

  if (!blog) {
    return <Container className="py-5 text-center">Bài viết không tồn tại</Container>;
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        <Card className="shadow-lg border-0">
          <Card.Img variant="top" src={blog.image} alt={blog.title} style={{ height: '400px', objectFit: 'cover' }} />
          <Card.Body>
            <h2 className="fw-bold">{blog.title}</h2>
            <p className="text-muted">Tác giả: {blog.author} | Ngày đăng: {blog.date}</p>
            <p className="lead">{blog.excerpt}</p>
            <hr />
            <p>{blog.content}</p>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
