package com.toystore.backend.controller;

import com.toystore.backend.model.Category;
import com.toystore.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // POST /api/categories
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    // GET /api/categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // GET /api/categories/{id}
    @GetMapping("/{id}")
    public Optional<Category> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id);
    }

    // PUT /api/categories/{id}
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    // DELETE /api/categories/{id}
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully!";
    }
}