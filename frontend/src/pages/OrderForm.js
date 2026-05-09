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

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrder(order);
            alert('✅ Order created successfully!');
            navigate('/');
        } catch (error) {
            alert('❌ Error creating order!');
        }
    };

    return (
        <div>
            <h2 className="page-title">➕ Create New Order</h2>
            <div className="form-card">
                <div className="form-group">
                    <label>👤 Customer Name</label>
                    <input name="customerName" placeholder="Enter customer name" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>📧 Email</label>
                    <input name="customerEmail" placeholder="Enter email" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>📱 Phone Number</label>
                    <input name="phoneNumber" placeholder="Enter phone number" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>📍 Delivery Address</label>
                    <input name="deliveryAddress" placeholder="Enter delivery address" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>🧸 Product Name</label>
                    <input name="productName" placeholder="Enter product name" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>🔢 Quantity</label>
                    <input name="quantity" type="number" placeholder="Enter quantity" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>💰 Total Price</label>
                    <input name="totalPrice" type="number" placeholder="Enter total price" onChange={handleChange} />
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