import React, { useEffect, useState } from 'react';
import { getAllOrders, deleteOrder } from '../services/orderService';

function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            await deleteOrder(id);
            fetchOrders();
        }
    };

    return (
        <div>
            <h2 className="page-title">📋 All Orders</h2>
            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>🛒 No orders yet! Create your first order.</p>
                </div>
            ) : (
                <table className="order-table">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.customerName}</td>
                            <td>{order.productName}</td>
                            <td>{order.quantity}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.paymentMethod}</td>
                            <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                            </td>
                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(order.id)}>
                                    🗑️ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderList;