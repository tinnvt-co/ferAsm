import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { use } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [product, setProduct] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [visibleCount, setVisibleCount] = useState(12);

  //filter states
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productsResponse = await axios.get(
          "http://localhost:9999/products"
        );
        setProduct(productsResponse.data);

        const blogsResponse = await axios.get("http://localhost:9999/blogs");
        setBlogs(blogsResponse.data);

        const categoriesResponse = await axios.get(
          "http://localhost:9999/categories"
        );
        setCategories(categoriesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setErr("Lỗi khi lấy dữ liệu từ server.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải danh sách sản phẩm...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-4">
        <h1 className="fw-bold mb-4 text-center">Danh sách sản phẩm</h1>
        <Row>
          <Col lg={3} md={4}>
            <Card>
              <Card.Body>
                <h4 className="mb-3"> Bộ lọc sản phẩm</h4>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tìm kiếm</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      value={searchName}
                      onChange={(e)=>setSearchName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Danh mục</Form.Label>
                    <Form.Select value={selectedCategory}
                    onChange={(e)=> setSelectedCategory(e.target.value)}>
                      <option value="">Tất Cả Danh Mục</option>
                      {categories.map((categories) => (
                        <option key={categories.id} value={categories.id}>
                          {categories.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Giá tối thiểu (VND)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập giá tối thiểu..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Giá tối Đa (VND)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập giá tối đa..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sắp xếp theo</Form.Label>
                    <Form.Select>
                      <option value="default">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                      <option value="name-asc">Tên: A-Z</option>
                      <option value="name-desc">Tên: Z-A</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            <h4 className="mb-3">Bài Viết nổi bật</h4>
            {blogs.map((blog)=>(
                <Card key={blog.id} className="mb-3 shadow-sm">
                    <Card.Img src={blog.image}
                        alt={blog.title}
                        style={{ height: "120px", objectFit: "cover" }}
                     />
                     <Card.Body>
                        <Card.Title className="fs-6"> 
                            {blog.title}
                        </Card.Title>
                     </Card.Body>
                </Card>
            ))}
          </Col>
              <Col lg={9} md={8}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <Row>

                </Row>
            </div>
              </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
