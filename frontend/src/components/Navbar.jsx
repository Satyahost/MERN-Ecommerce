import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'

import '../componentStyles/Navbar.css'
import '../pageStyles/Search.css'
import { useSelector } from 'react-redux'

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate()

    // ✅ Correct Redux state
    const { isAuthenticated } = useSelector(state => state.user)
    const { cartItems = [] } = useSelector(state => state.cart)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()

        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate(`/products`)
        }

        setSearchQuery("")
        setIsSearchOpen(false)
    }

    const handleSearchClick = () => {
        if (isSearchOpen && searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery("")
            setIsSearchOpen(false) 
            return 
        }

        setIsSearchOpen(!isSearchOpen)
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <div className="navbar-logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        ECart
                    </Link>
                </div>

                {/* Navbar Links */}
                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                                Products
                            </Link>
                        </li>

                        <li>
                            <Link to="/about-us" onClick={() => setIsMenuOpen(false)}>
                                About Us
                            </Link>
                        </li>

                        <li>
                            <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Icons Section */}
                <div className="navbar-icons">

                    {/* Search */}
                    <div className="search-container">
                        <form
                            className={`search-form ${isSearchOpen ? 'active' : ''}`}
                            onSubmit={handleSearchSubmit}
                        >
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button
                                type="button"
                                className="search-icon"
                                onClick={handleSearchClick}
                            >
                                <SearchIcon />
                            </button>
                        </form>
                    </div>

                    {/* Cart */}
                    <div className="cart-container">
                        <Link to="/cart">
                            <ShoppingCartIcon className="icon" />
                            <span className="cart-badge">
                                {cartItems.length}
                            </span>
                        </Link>
                    </div>

                    {/* Register Icon */}
                    {!isAuthenticated && (
                        <Link to="/register" className="register-link">
                            <PersonAddIcon className="icon" />
                        </Link>
                    )}

                    {/* Hamburger Menu */}
                    <div className="navbar-hamburger" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <CloseIcon className="icon" />
                        ) : (
                            <MenuIcon className="icon" />
                        )}
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar