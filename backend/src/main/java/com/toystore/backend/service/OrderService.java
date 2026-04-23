package com.toystore.backend.service;

import com.toystore.backend.model.Order;
import com.toystore.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order updateOrder(String id, Order updatedOrder) {
        updatedOrder.setId(id);
        updatedOrder.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(updatedOrder);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}