import React, { useEffect } from "react";
import "../OrderStyles/MyOrders.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { LaunchOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, getAllMyOrders } from "../features/order/orderSlice";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { orders, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      });

      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <Navbar />
      <PageTitle title="My Orders" />

      <div className="my-orders-container">
        <h1 className="orders-heading">My Orders</h1>

        {loading ? (
          <p className="loading-text">Loading orders...</p>
        ) : orders && orders.length > 0 ? (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items Count</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>View Order</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>

                    <td>{order.orderItems?.length || 0}</td>

                    <td>
                      <span
                        className={
                          order.orderStatus === "Delivered"
                            ? "status-delivered"
                            : "status-processing"
                        }
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>₹{order.totalPrice}</td>

                    <td>
                      <Link
                        to={`/order/${order._id}`}
                        className="order-link"
                      >
                        <LaunchOutlined />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyOrders;