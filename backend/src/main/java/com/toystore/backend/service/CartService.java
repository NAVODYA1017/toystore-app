package com.toystore.backend.service;

import com.toystore.backend.model.Cart;
import com.toystore.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart getCart(String customerId) {
        return cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setCustomerId(customerId);
                    return cartRepository.save(cart);
                });
    }

    public Cart addItem(String customerId, Cart.CartItem item) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setCustomerId(customerId);
                    return c;
                });
        cart.getItems().removeIf(i -> i.getProductId().equals(item.getProductId()));
        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String customerId, String productId, int quantity) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow();
        cart.getItems().forEach(i -> {
            if (i.getProductId().equals(productId)) i.setQuantity(quantity);
        });
        return cartRepository.save(cart);
    }

    public Cart removeItem(String customerId, String productId) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow();
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    public String placeOrder(String customerId, String paymentMethod) {
        cartRepository.findByCustomerId(customerId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
        return "Order placed successfully with " + paymentMethod;
    }
}