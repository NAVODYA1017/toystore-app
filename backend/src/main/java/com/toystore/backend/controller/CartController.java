package com.toystore.backend.controller;

import com.toystore.backend.model.Cart;
import com.toystore.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{customerId}")
    public Cart getCart(@PathVariable String customerId) {
        return cartService.getCart(customerId);
    }

    @PostMapping("/{customerId}/add")
    public Cart addItem(@PathVariable String customerId, @RequestBody Cart.CartItem item) {
        return cartService.addItem(customerId, item);
    }

    @PutMapping("/{customerId}/update/{productId}")
    public Cart updateQuantity(@PathVariable String customerId,
                               @PathVariable String productId,
                               @RequestParam int quantity) {
        return cartService.updateQuantity(customerId, productId, quantity);
    }

    @DeleteMapping("/{customerId}/remove/{productId}")
    public Cart removeItem(@PathVariable String customerId, @PathVariable String productId) {
        return cartService.removeItem(customerId, productId);
    }

    @PostMapping("/orders/{customerId}/place")
    public String placeOrder(@PathVariable String customerId,
                             @RequestParam String paymentMethod) {
        return cartService.placeOrder(customerId, paymentMethod);
    }
}