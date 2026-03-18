package com.toystore.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data                    // Encapsulation ← generates private getters/setters
@NoArgsConstructor       // default constructor
@AllArgsConstructor      // constructor with all fields
@Document(collection = "products")
public class Product {

    // Encapsulation - all fields are private
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String category;

    // Polymorphism - override toString
    @Override
    public String toString() {
        return "Product{name=" + name + ", price=" + price + "}";
    }

    // Inheritance - custom method
    public String getProductSummary() {
        return name + " costs Rs." + price + " | Stock: " + stock;
    }
}