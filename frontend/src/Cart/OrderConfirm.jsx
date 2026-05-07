import React from 'react'
import '../CartStyles/OrderConfirm.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import CheckoutPath from './CheckoutPath'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const OrderConfirm = () => {
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const navigate = useNavigate()

    // ✅ FIX 1: Redirect back to shipping if shippingInfo is missing or incomplete
    useEffect(() => {
        if (!shippingInfo || !shippingInfo.phoneNumber) {
            navigate('/shipping', { replace: true })
        }
    }, [shippingInfo, navigate])

    // ✅ FIX 2: Redirect to cart if cartItems is empty
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart', { replace: true })
        }
    }, [cartItems, navigate])

    // ✅ FIX 3: Guard render — don't render until shippingInfo and cartItems are ready
    // Prevents the "Cannot read properties of undefined" crash during redirect
    if (!shippingInfo?.phoneNumber || !cartItems?.length) return null

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.18
    const shippingCharges = subtotal > 500 ? 0 : 50
    const total = subtotal + tax + shippingCharges

    const proceedToPayment = () => {
        const data = { subtotal, tax, shippingCharges, total }
        sessionStorage.setItem('orderItem', JSON.stringify(data))
        navigate('/process/payment')
    }

    return (
        <>
            <PageTitle title="Order confirm" />
            <Navbar />
            <CheckoutPath activePath={1} />
            <div className="confirm-container">
                <h1 className="confirm-header">Order Confirmation</h1>
                <div className="confirm-table-container">

                    {/* Shipping Details */}
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {/* ✅ FIX 4: Optional chaining on all shippingInfo fields */}
                                <td>{user?.name}</td>
                                <td>{shippingInfo?.phoneNumber}</td>
                                <td>
                                    {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.state}, {shippingInfo?.country} - {shippingInfo?.pinCode}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Cart Items */}
                    <table className="confirm-table cart-table">
                        <caption>Cart Items</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product}>
                                    <td><img src={item.image} alt={item.name} className='product-image' /></td>
                                    <td>{item.name}</td>
                                    {/* ✅ FIX 5: toFixed(2) for consistent currency formatting */}
                                    <td>₹{item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Order Summary */}
                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                <th>Shipping Charges</th>
                                <th>GST (18%)</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>₹{subtotal.toFixed(2)}</td>
                                <td>{shippingCharges === 0 ? 'Free' : `₹${shippingCharges}`}</td>
                                <td>₹{tax.toFixed(2)}</td>
                                <td>₹{total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="proceed-button" onClick={proceedToPayment}>
                    Proceed to Payment
                </button>
            </div>
            <Footer />
        </>
    )
}

export default OrderConfirm