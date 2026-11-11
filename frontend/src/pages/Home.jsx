
import React, { useEffect } from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Home = () => {
  const { loading, error, products } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  // Fetch products
  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast.error(
        error.message || "Unable to load products",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );

      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Home-My Website" />

          <Navbar />

          <ImageSlider />

          <div className="home-container">
            <h2 className="home-heading">
              Trending Now
            </h2>

            <div className="home-product-container">
              {safeProducts.length > 0 ? (
                safeProducts.map((product) => (
                  <Product
                    product={product}
                    key={product._id}
                  />
                ))
              ) : (
                <p className="no-products">
                  No products available right now.
                </p>
              )}
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
