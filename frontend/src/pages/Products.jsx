import React, { useEffect, useCallback, useMemo } from 'react'
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import { getProduct, removeErrors } from '../features/products/productSlice'
import Loader from '../components/Loader'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import NoProduct from '../components/NoProduct'
import Pagination from '../components/Pagination'

const CATEGORIES = ['Laptop', 'Mobile', 'TV' ,'Headphone','Watch', 'Shirt', 'Pant','Jacket']

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
]

const Products = () => {
  
  const { loading, error, products, resultPerPage, productCount, totalPages } = useSelector(state => state.product)
  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const currentPage = parseInt(searchParams.get('page'), 10) || 1

  
  const sortedProducts = useMemo(() => {
    if (!products) return []
    if (sort === 'price_asc') return [...products].sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') return [...products].sort((a, b) => b.price - a.price)
    return products
  }, [products, sort])

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }))
  }, [dispatch, keyword, currentPage, category])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, category, keyword])

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: 'top-center',
        autoClose: 2000,
        toastId: 'products-error',
      })
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  const handlePageChange = useCallback((page) => {
    if (page === currentPage) return
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      page === 1 ? next.delete('page') : next.set('page', page)
      return next
    })
  }, [currentPage, setSearchParams])

  const handleCategoryClick = useCallback((selectedCategory) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.get('category') === selectedCategory
        ? next.delete('category')
        : next.set('category', selectedCategory)
      next.delete('page')
      next.delete('keyword')   
      return next
    })
  }, [setSearchParams])

  const handleClearCategory = useCallback(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('category')
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  
  const handleSortChange = useCallback((value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      value ? next.set('sort', value) : next.delete('sort')
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />

      <div className="products-layout">

        {/* ── Sidebar Filter ── */}
        <div className="filter-section">

          <h3 className="filter-heading">CATEGORIES</h3>
          <ul>
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={category === cat ? 'active-category' : ''}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </li>
            ))}
          </ul>
          {category && (
            <button className="clear-filter-btn" onClick={handleClearCategory}>
              ✕ Clear Filter
            </button>
          )}

          {/* ── Sort by Price ── */}
          <div className="sort-section">
            <h3 className="filter-heading sort-heading">SORT BY PRICE</h3>
            <div className="sort-options">
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`sort-option${sort === opt.value ? ' active-sort' : ''}`}
                  onClick={() => handleSortChange(opt.value)}
                >
                  <span className="sort-radio-dot" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* ── Products Grid ── */}
        <div className="products-section">

          {!loading && productCount > 0 && (
            <p className="results-count">
              Showing {sortedProducts.length} of {productCount} products
              {keyword && <span> for "<strong>{keyword}</strong>"</span>}
              {category && <span> in <strong>{category}</strong></span>}
              {sort && (
                <span> · <strong>{SORT_OPTIONS.find(o => o.value === sort)?.label}</strong></span>
              )}
            </p>
          )}

          {loading ? (
            <div className="products-loader-wrapper">
              <Loader />
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="products-product-container">
              {sortedProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProduct keyword={keyword} />
          )}

          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Products