import React, { useEffect } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './User/Register'
import Login from './User/Login'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './features/user/userSlice'
import { loadUserCart, clearCart } from './features/cart/cartSlice'
import UserDashboard from './User/UserDashboard'
import Profile from './User/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import UpdateProfile from './User/UpdateProfile'
import UpdatePassword from './User/UpdatePassword'
import ForgotPassword from './User/ForgotPassword'
import ResetPassword from './User/ResetPassword'

import Shipping from './Cart/Shipping'
import OrderConfirm from './Cart/OrderConfirm'
import Payment from './Cart/Payment'
import PaymentSuccess from './Cart/PaymentSuccess'
import MyOrders from './Orders/MyOrders'
import OrderDetails from './Orders/OrderDetails'
import Dashboard from './Admin/Dashboard'
import ProductsList from './Admin/ProductsList'
import CreateProduct from './Admin/CreateProduct'
import UpdateProduct from './Admin/UpdateProduct'
import UpdateRole from './Admin/UpdateRole'
import UserList from './Admin/UserList'
import OrdersList from './Admin/OrdersList'
import UpdateOrder from './Admin/UpdateOrder'
import ReviewsList from './Admin/ReviewsList'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Cart from './Cart/Cart'

const App = () => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch()

  // Always call loadUser on app start (not just when isAuthenticated)
  // This lets the server verify the cookie/token and restore the session
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  // Whenever auth state changes and user is available,
  // load THAT user's cart from localStorage (user-specific key)
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Clear any leftover guest cart items from Redux state first
      dispatch(clearCart(null)) // null = don't touch localStorage, just reset state
      // Then load this specific user's saved cart
      dispatch(loadUserCart(user._id))
    } else if (!isAuthenticated) {
      // User logged out — clear Redux cart state so it doesn't leak to next user
      dispatch(clearCart(null))
    }
  }, [isAuthenticated, user?._id, dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
        <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
        <Route path="/process/payment" element={<ProtectedRoute element={<Payment />} />} />
        <Route path="/paymentSuccess" element={<ProtectedRoute element={<PaymentSuccess />} />} />
        <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders />} />} />
        <Route path="/order/:orderId" element={<ProtectedRoute element={<OrderDetails />} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList />} adminOnly={true} />} />
        <Route path="/admin/product/create" element={<ProtectedRoute element={<CreateProduct />} adminOnly={true} />} />
        <Route path="/admin/product/:updateId" element={<ProtectedRoute element={<UpdateProduct />} adminOnly={true} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<UserList />} adminOnly={true} />} />
        <Route path="/admin/user/:userId" element={<ProtectedRoute element={<UpdateRole />} adminOnly={true} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList />} adminOnly={true} />} />
        <Route path="/admin/order/:orderId" element={<ProtectedRoute element={<UpdateOrder />} adminOnly={true} />} />
        <Route path="/admin/reviewId" element={<ProtectedRoute element={<ReviewsList />} adminOnly={true} />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
      
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  )
}

export default App