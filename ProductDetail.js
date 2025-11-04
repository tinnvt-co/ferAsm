import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Card,
  Badge,
} from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import AddToCart from "./AddToCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9999/products/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);

          // Fetch related products
          const productsResponse = await fetch(
            `http://localhost:9999/products?categoryId=${data.categoryId}`
          );
          const productsData = await productsResponse.json();
          setRelatedProducts(
            productsData.filter((p) => p.id !== data.id).slice(0, 6)
          );

          // Fetch blogs
          const blogsResponse = await fetch(
            "http://localhost:9999/blogs?_limit=2"
          );
          setBlogs(await blogsResponse.json());
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <Container className="py-5 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h4 className="mt-3">{error || "Không tìm thấy sản phẩm"}</h4>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/products")}
              className="mt-3"
            >
              Quay lại danh sách sản phẩm
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container className="mt-5">
        <Row>
          <Col md={3}>
            <h4 className="fw-bold">Bài viết nổi bật</h4>
            {blogs.map((blog) => (
              <Card key={blog.id} className="mb-3 shadow-sm">
                <Card.Img variant="top" src={blog.image} alt={blog.title} />
                <Card.Body>
                  <Card.Title className="text-truncate">
                    {blog.title}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    {blog.excerpt}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <div className="position-relative">
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="rounded shadow"
                style={{
                  maxWidth: "100%",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
              {product.stock <= 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 end-0 m-2"
                >
                  Hết hàng
                </Badge>
              )}
            </div>
          </Col>
          <Col md={5}>
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <h4 className="text-primary mb-3">
              {product.price.toLocaleString()} VND
            </h4>
            <p className="mb-3">
              <strong>Còn lại:</strong> {product.stock} sản phẩm
            </p>

            <AddToCart
              product={product}
              showQuantity={true}
              buttonText="Thêm vào giỏ hàng"
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">Bạn có thể sẽ muốn mua thêm</h4>
          <Button
            variant="outline-success"
            onClick={() => navigate("/products")}
          >
            Xem thêm
          </Button>
        </div>
        <Row>
          {relatedProducts.map((product) => (
            <Col key={product.id} md={2} className="mb-3">
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="text-truncate">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {product.name}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-primary">
                    {product.price.toLocaleString()} VND
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default ProductDetail;
