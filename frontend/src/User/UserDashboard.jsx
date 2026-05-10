import React, { useReducer, useState } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout, removeSuccess } from '../features/user/userSlice'

const UserDashboard = ({ user }) => {
  const {cartItems}=useSelector(state=>state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  function toggleMenu() {
    setMenuVisible(!menuVisible)
  }

  function orders() {
    navigate('/order/user')
  }

  function profile() {
    navigate('/profile')
  }

  function myCart(){
    navigate("/cart")
  }

  function dashboard() {
    navigate('/admin/dashboard')
  }

  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Logout Successful', {
          position: 'top-center',
          autoClose: 2000,
        })
        dispatch(removeSuccess())
        navigate('/login')
      })
      .catch((error) => {
        toast.error(error.message || 'Logout failed', {
          position: 'top-center',
          autoClose: 2000,
        })
      })
  }

  const options = [
    { name: 'Orders', funcName: orders },
    { name: 'Account', funcName: profile },
    { name: `Cart(${cartItems.length})`, funcName: myCart,isCart:true},
    { name: 'Logout', funcName: logoutUser },
  ]

  if (user?.role === 'admin') {
    options.unshift({
      name: 'Admin Dashboard',
      funcName: dashboard,
    })
  }

  return (
    <>
      <div
        className={`overlay ${menuVisible ? 'show' : ''}`}
        onClick={toggleMenu}
      ></div>

      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
          <img
            src={user?.avatar?.url || './images/profile.png'}
            alt="Profile"
            className="profile-avatar"
          />
          <span className="profile-name">{user?.name || 'User'}</span>
        </div>

        {menuVisible && (
          <div className="menu-options">
            {options.map((item) => (
              <button
                key={item.name}
                className={`menu-option-btn ${item.isCart?(cartItems.length>0?'cart-not-enpty':' '):''}`}
                onClick={item.funcName}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default UserDashboard