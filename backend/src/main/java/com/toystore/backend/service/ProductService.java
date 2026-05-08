package com.toystore.backend.service;

import com.toystore.backend.model.Product;
import com.toystore.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(String id, Product productDetails) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(productDetails.getName());
            existing.setDescription(productDetails.getDescription());
            existing.setPrice(productDetails.getPrice());
            existing.setStockQuantity(productDetails.getStockQuantity());
            existing.setImageUrl(productDetails.getImageUrl());
            existing.setCategoryId(productDetails.getCategoryId());
            return productRepository.save(existing);
        });
    }

    public boolean deleteProduct(String id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return true;
        }).orElse(false);
    }
}