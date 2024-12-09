

// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Home from './components/home'
import ProductDetails from './components/viewSingle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />

      </Routes>
    </Router>
  );
}

export default App;


