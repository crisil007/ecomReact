

// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Home from './components/home'
import ProductDetails from './components/viewSingle';
import Signin from './components/signin';
import Cart from './components/cart';
import SellerHomePage from './components/sellerHome';
import AddProduct from './components/Addproduct';
import Wishlist from './components/wishlist';
import OrderPage from './components/order';
import ProductList from './components/sellermain';
import UserList from './components/admin/viewUsers';
import UserView from './components/admin/viewSingleuser';
import ProductsPage from './components/Brandpage';
import UpgradeRequest from './components/upgrade';
import AdminDashboard from './components/admin/adminHome';
import './styles/tailwind.css';
import ViewUserOrders from './components/myOrders';
import ManageUpgradeRequests from './components/admin/requests';
// import OrderPage from './components/order';


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
        <Route path='/seller' element={<SellerHomePage/>}/>
        <Route path='/sellerhome' element={<ProductList/>}/>
        <Route path='/add' element={<AddProduct/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/order/:id' element={<OrderPage/>}/>
        <Route path='/users' element={<UserList/>}/>
        <Route path='/addproduct'element={<AddProduct/>}/>
        <Route path='/seller/home'element={<ProductList/>}/>
        {/* <Route path='/ordersucess'element={<OrderPage/>}/> */}




{/* admin */}
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/singleview/:id' element={<UserView/>}/>
        


        {/* fetch brand */}
        <Route path="/brands/:brand" element={<ProductsPage />} />
        <Route path="/myorder" element ={<ViewUserOrders/>}/>


        <Route path="/upgrade-request" element={<UpgradeRequest/>}/>
        <Route path ="/admin/requests" element={<ManageUpgradeRequests/>}/>

      </Routes>
    </Router>
  );
}

export default App;


