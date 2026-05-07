import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.user)
  const location = useLocation()

  // ✅ FIX 1: While loadUser is in progress, show loader — never redirect yet.
  // Without this, isAuthenticated is false for a split second on every page
  // refresh, which pushes a /login entry into history even for logged-in users.
  if (loading) {
    return <Loader />
  }

  // ✅ FIX 2: Use replace={true} so redirecting to /login does NOT add a new
  // history entry. Without this, pressing Back takes user to the protected
  // page, which immediately redirects again — creating an infinite back loop.
  // Also save current location so we can redirect back after login.
  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }

  // ✅ FIX 3: Same replace fix for admin redirect
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  return element
}

export default ProtectedRoute