package com.example.todoappdeel3.dao;

import com.example.todoappdeel3.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

//maps the product class to the database using the Long type as default of ID's
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<List<Product>> findByCategoryId(long id);

    List<Product> findByCategoryName(String categoryName);

    List<Product> findByColorIn(List<String> colors);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.product_id = :productId")
    void updateStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);
}
