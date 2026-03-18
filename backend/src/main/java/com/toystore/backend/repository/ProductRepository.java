package com.toystore.backend.repository;

import com.toystore.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    // Find products by category
    List<Product> findByCategory(String category);

    // Find products by name
    List<Product> findByName(String name);

    // Find products with price less than given value
    List<Product> findByPriceLessThan(double price);

    // Find products with stock greater than zero
    List<Product> findByStockGreaterThan(int stock);

}