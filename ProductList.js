import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddToCart from "./AddToCart";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all products
        const productsResponse = await axios.get(
          "http://localhost:9999/products"
        );
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:9999/categories"
        );
        setCategories(categoriesResponse.data);

        // Fetch blogs
        const blogsResponse = await axios.get(
          "http://localhost:9999/blogs?_limit=3"
        );
        setBlogs(blogsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError(
          "Có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.categoryId === parseInt(selectedCategory)
      );
    }

    // Filter by price range
    if (minPrice !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep default order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, minPrice, maxPrice, sortBy, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setSearchQuery("");
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

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
        {error && <Alert variant="danger">{error}</Alert>}

        <h2 className="fw-bold mb-4 text-center">Danh sách sản phẩm</h2>

        <Row>
          {/* Bộ lọc bên trái */}
          <Col lg={3} md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3">Bộ lọc sản phẩm</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tìm kiếm</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Giá tối thiểu (VND)</Form.Label>
                    <Form.Control
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Giá tối đa (VND)</Form.Label>
                    <Form.Control
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Nhập giá tối đa"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sắp xếp theo</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                      <option value="name-asc">Tên: A-Z</option>
                      <option value="name-desc">Tên: Z-A</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={handleClearFilters}
                  >
                    Xóa bộ lọc
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Bài viết nổi bật */}
            <h5 className="fw-bold mb-3">Bài viết nổi bật</h5>
            {blogs.map((blog) => (
              <Card key={blog.id} className="mb-3 shadow-sm">
                <Card.Img
                  variant="top"
                  src={blog.image}
                  alt={blog.title}
                  style={{ height: "120px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="text-decoration-none"
                    >
                      {blog.title}
                    </Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Danh sách sản phẩm */}
          <Col lg={9} md={8}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
              <p className="mb-0">
                Hiển thị {Math.min(visibleCount, filteredProducts.length)} /{" "}
                {filteredProducts.length} sản phẩm
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="bi bi-search"
                  style={{ fontSize: "3rem", color: "#ccc" }}
                ></i>
                <h4 className="mt-3">Không tìm thấy sản phẩm</h4>
                <p className="text-muted">
                  Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn.
                </p>
                <Button variant="outline-success" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <Row>
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <Col key={product.id} lg={4} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm product-card">
                      <div className="position-relative">
                        <Link to={`/product/${product.id}`}>
                          <Card.Img
                            variant="top"
                            src={product.image}
                            alt={product.name}
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        </Link>
                        {product.stock <= 0 && (
                          <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                            Hết hàng
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="position-absolute top-0 start-0 bg-warning text-white px-2 py-1 m-2 rounded">
                            Giảm {product.discount}%
                          </div>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="text-truncate">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-decoration-none text-dark"
                          >
                            {product.name}
                          </Link>
                        </Card.Title>
                        <Card.Text
                          className="text-muted small flex-grow-1"
                          style={{ minHeight: "60px", overflow: "hidden" }}
                        >
                          {product.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Card.Text className="fw-bold text-primary mb-0">
                            {product.price.toLocaleString()} VND
                          </Card.Text>
                          <small className="text-muted">
                            Còn {product.stock} sản phẩm
                          </small>
                        </div>
                        <AddToCart
                          product={product}
                          buttonText="Thêm vào giỏ"
                          showQuantity={false}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-4">
                <Button variant="outline-success" onClick={handleLoadMore}>
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
