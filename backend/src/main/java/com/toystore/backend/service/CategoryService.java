package com.toystore.backend.service;

import com.toystore.backend.model.Category;
import com.toystore.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // CREATE
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // READ ALL
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // READ ONE
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    // UPDATE
    public Category updateCategory(String id, Category updatedCategory) {
        updatedCategory.setId(id);
        return categoryRepository.save(updatedCategory);
    }

    // DELETE
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}