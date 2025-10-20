import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './component/HomePage';
import Login from './component/Login';
import Register from './component/Register';
function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </BrowserRouter>
            <div>FER202 - Practical Exam given</div>
        </>
    );
}

export default App;