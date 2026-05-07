import React, { useEffect, useState } from "react";
import "../AdminStyles/ReviewsList.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReview,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ReviewsList = () => {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin,
  );

  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleViewReviews = (productId) => {
    setSelectedProduct(productId);
    dispatch(fetchProductReviews(productId));
  };

  const handleDeleteReview = (productId, reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );
    if (confirmDelete) {
      dispatch(deleteReview({ productId, reviewId }));
    }
  };

  // Success handling
  useEffect(() => {
    if (success) {
      toast.success(message || "Action successful", {
        position: "top-center",
        autoClose: 3000,
      });

        dispatch(fetchAdminProducts());
        dispatch(fetchProductReviews(selectedProduct));
      dispatch(removeSuccess());
      dispatch(clearMessage());
    }
  }, [dispatch, success, message]);

  if (!products || products.length === 0) {
    return (
      <div className="reviews-list-container">
        <h1 className="reviews-list-title">Admin Reviews</h1>
        <p>No Product Found</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Reviews" />

          <div className="reviews-list-container">
            <h1 className="reviews-list-title">All Products</h1>

            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Number of Reviews</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>

                    <td>
                      <img
                        src={product.image?.[0]?.url}
                        alt="product"
                        className="product-image"
                      />
                    </td>

                    <td>{product.numberOfReviews}</td>

                    <td>
                      {product.numberOfReviews > 0 && (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewReviews(product._id)}
                        >
                          View Reviews
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Reviews Section */}
            {selectedProduct && reviews?.length > 0 && (
              <div className="reviews-details">
                <h2>Reviews</h2>

                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Reviewer Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>

                        <td>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteReview(selectedProduct, review._id)
                            }
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default ReviewsList;
