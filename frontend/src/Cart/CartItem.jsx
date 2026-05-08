import React, { useState, useEffect } from 'react';
import '../CartStyles/CartItem.css'
import { toast } from 'react-toastify';
import { addItemsToCart, removeErrors, removeItemFromCart, removeMessage } from '../features/cart/cartSlice';
import { useSelector, useDispatch } from 'react-redux';

const CartItem = ({ item }) => {
  const { success, loading, error, message } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user); // ✅ get logged-in user
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(item.quantity);

  const increaseQuantity = () => {
    if (quantity >= item.stock) {
      toast.error('Cannot exceed available stock!');
      return;
    }
    setQuantity(qty => qty + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }
    setQuantity(qty => qty - 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== item.quantity) {
      dispatch(addItemsToCart({ id: item.product, quantity }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: 'cart-update' });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Cart updated successfully", { toastId: 'cart-update' });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleRemove = () => {
    if (loading) return;
    // FIX: pass { productId, userId } instead of just item.product
    dispatch(removeItemFromCart({
      productId: item.product,
      userId: user?._id || null
    }));
  };

  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt={item.name} className='item-image' />
        <div className="item-details">
          <h3>{item.name}</h3>
          <p><strong>Price:</strong> {item.price.toFixed(2)}/-</p>
          <p><strong>{item.quantity}</strong></p>
        </div>
      </div>

      <div className="quantity-controls">
        <button onClick={decreaseQuantity} disabled={loading}>-</button>
        <input type="number" value={quantity} readOnly />
        <button onClick={increaseQuantity} disabled={loading}>+</button>
      </div>

      <div className="item-total">
        <span>{(item.price * quantity).toFixed(2)}/-</span>
      </div>

      <div className="item-actions">
        <button
          className='update-item-btn'
          onClick={handleUpdate}
          disabled={loading || quantity === item.quantity}
        >
          {loading ? 'Updating' : 'Update'}
        </button>
        <button className='remove-item-btn' disabled={loading} onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;