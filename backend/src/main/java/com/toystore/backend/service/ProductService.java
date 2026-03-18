package com.toystore.backend.service;

import com.toystore.backend.model.Product;
import com.toystore.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    // Encapsulation - repository is private
    @Autowired
    private ProductRepository productRepository;

    // CREATE - Add new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // READ ALL - Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // READ ONE - Get single product by ID
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    // UPDATE - Update existing product
    public Product updateProduct(String id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Polymorphism - same update method handles any field change
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());

        return productRepository.save(product);
    }

    // DELETE - Remove product
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // EXTRA - Find by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // EXTRA - Find by price range
    public List<Product> getProductsByMaxPrice(double price) {
        return productRepository.findByPriceLessThan(price);
    }
}