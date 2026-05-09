import React from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function Payment() {
  const orderItem = JSON.parse(sessionStorage.getItem('orderItem'))
  const { user } = useSelector(state => state.user)
  const { shippingInfo } = useSelector(state => state.cart)
  const navigate = useNavigate();

  const completePayment = async (amount) => {
    try {
      // Check Razorpay script is loaded
      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please refresh the page.",
          { position: "top-center", autoClose: 3000 });
        return;
      }

      // Check amount is valid
      if (!amount || amount <= 0) {
        toast.error("Invalid payment amount.",
          { position: "top-center", autoClose: 3000 });
        return;
      }

      const { data: keyData } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/getKey`, { withCredentials: true });
      const { key } = keyData;

      const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/payment/process`, { amount }, { withCredentials: true });
      const { order } = orderData;
     

      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Ecart',
        description: 'Ecommerce website Payment Transaction',
        order_id: order.id,
        handler: async function (response) {
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/paymentVerification`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          }, { withCredentials: true });
          if (data.success) {
            navigate(`/paymentSuccess?reference=${data.reference}`)
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: `+91${shippingInfo.phoneNumber}`  
        },
        theme: {
          color: '#2d72c7'
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
    }
  }

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to='/order/confirm' className='payment-go-back'>Go Back</Link>
        <button className='payment-btn' onClick={() => completePayment(Math.round(orderItem.total * 100))}>
         
          Pay ({orderItem.total})/-
        </button>  
      </div>
      <Footer />
    </>
  )
}

export default Payment