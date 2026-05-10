import React, { useState } from 'react';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

function OrderForm() {
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        customerName: '',
        customerEmail: '',
        phoneNumber: '',
        deliveryAddress: '',
        productName: '',
        quantity: '',
        totalPrice: '',
        paymentMethod: 'CASH',
        status: 'PENDING'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrder(order);
            alert('✅ Order created successfully!');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data);
            } else {
                alert('❌ Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2 className="page-title">➕ Create New Order</h2>
            <div className="form-card">
                <div className="form-group">
                    <label>👤 Customer Name</label>
                    <input name="customerName" placeholder="Enter customer name" onChange={handleChange} />
                    {errors.customerName && <p style={{color:'red'}}>{errors.customerName}</p>}
                </div>
                <div className="form-group">
                    <label>📧 Email</label>
                    <input name="customerEmail" placeholder="Enter email" onChange={handleChange} />
                    {errors.customerEmail && <p style={{color:'red'}}>{errors.customerEmail}</p>}
                </div>
                <div className="form-group">
                    <label>📱 Phone Number</label>
                    <input name="phoneNumber" placeholder="Enter phone number" onChange={handleChange} />
                    {errors.phoneNumber && <p style={{color:'red'}}>{errors.phoneNumber}</p>}
                </div>
                <div className="form-group">
                    <label>📍 Delivery Address</label>
                    <input name="deliveryAddress" placeholder="Enter delivery address" onChange={handleChange} />
                    {errors.deliveryAddress && <p style={{color:'red'}}>{errors.deliveryAddress}</p>}
                </div>
                <div className="form-group">
                    <label>🧸 Product Name</label>
                    <input name="productName" placeholder="Enter product name" onChange={handleChange} />
                    {errors.productName && <p style={{color:'red'}}>{errors.productName}</p>}
                </div>
                <div className="form-group">
                    <label>🔢 Quantity</label>
                    <input name="quantity" type="number" placeholder="Enter quantity" onChange={handleChange} />
                    {errors.quantity && <p style={{color:'red'}}>{errors.quantity}</p>}
                </div>
                <div className="form-group">
                    <label>💰 Total Price</label>
                    <input name="totalPrice" type="number" placeholder="Enter total price" onChange={handleChange} />
                    {errors.totalPrice && <p style={{color:'red'}}>{errors.totalPrice}</p>}
                </div>
                <div className="form-group">
                    <label>💳 Payment Method</label>
                    <select name="paymentMethod" onChange={handleChange}>
                        <option value="CASH">💵 Cash</option>
                        <option value="CARD">💳 Card</option>
                        <option value="ONLINE">🌐 Online</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>📦 Status</label>
                    <select name="status" onChange={handleChange}>
                        <option value="PENDING">⏳ Pending</option>
                        <option value="SHIPPED">🚚 Shipped</option>
                        <option value="DELIVERED">✅ Delivered</option>
                        <option value="CANCELLED">❌ Cancelled</option>
                    </select>
                </div>
                <button className="btn-submit" onClick={handleSubmit}>
                    🌈 Create Order
                </button>
            </div>
        </div>
    );
}

export default OrderForm;