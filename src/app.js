import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './component/HomePage';
import Login from './component/Login';
import Register from './component/Register';
import Products from './component/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
