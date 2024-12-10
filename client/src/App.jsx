

// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Home from './components/home'
import ProductDetails from './components/viewSingle';
import Signin from './components/signin';
import Cart from './components/cart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/home/signin" element={<Signin/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path='/cart' element={<Cart/>}/>

      </Routes>
    </Router>
  );
}

export default App;


