import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5" role="contentinfo">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Liên hệ</h5>
            <p>Email: <a href="mailto:nguyenvutrantin@fpt.edu.vn" className="text-light text-decoration-none">nguyenvutrantin@fpt.edu.vn</a></p>
            <p>Điện thoại: <a href="tel:0868729129" className="text-light text-decoration-none">0868 729 129</a></p>
            <p>Địa chỉ: Trường Đại học FPT cơ sở Hòa Lạc, Thạch Thất, Hà Nội</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Trang chủ</Link></li>
              <li><Link to="/blogs" className="text-light text-decoration-none">Blog</Link></li>
              <li><Link to="/products" className="text-light text-decoration-none">Danh sách sản phẩm</Link></li>
              <li><Link to="/policy" className="text-light text-decoration-none">Chính sách bảo mật</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Theo dõi chúng tôi</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-light fs-4"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-light fs-4"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-light fs-4"><FaYoutube /></a>
            </div>
          </Col>
        </Row>
        <hr className="border-light" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} Your Website. All rights reserved.</p>
      </Container>
    </footer>
  );
}
