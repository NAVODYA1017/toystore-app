package com.toystore.backend.repository;

import com.toystore.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Find products by category
    List<Product> findByCategoryId(String categoryId);

    // Search products by name (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products below a certain price
    List<Product> findByPriceLessThanEqual(Double price);

    // Find products that are in stock
    List<Product> findByStockQuantityGreaterThan(Integer quantity);
}