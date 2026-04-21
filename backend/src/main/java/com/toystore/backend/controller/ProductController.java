package com.toystore.backend.controller;

import com.toystore.backend.model.Product;
import com.toystore.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // CREATE - POST /api/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product created = productService.createProduct(product);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL - GET /api/products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // READ ONE - GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {  // ✅ fixed
        Product product = productService.getProductById(id);                  // ✅ fixed
        return new ResponseEntity<>(product, HttpStatus.OK);                  // ✅ fixed
    }

    // UPDATE - PUT /api/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product productDetails) {
        Product updated = productService.updateProduct(id, productDetails);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // DELETE - DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // EXTRA - GET /api/products/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // EXTRA - GET /api/products/price/{maxPrice}
    @GetMapping("/price/{maxPrice}")
    public ResponseEntity<List<Product>> getByMaxPrice(@PathVariable double maxPrice) {
        List<Product> products = productService.getProductsByMaxPrice(maxPrice);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}