package com.example.todoappdeel3.dao;

import com.example.todoappdeel3.models.CustomUser;
import com.example.todoappdeel3.models.Order;
import com.example.todoappdeel3.models.OrderProducts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomUser_IdOrderByOrderIdDesc(Long customUserId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO order_products (order_id, product_id, quantity, product_status, description,created_at) VALUES (:orderId, :productId, :quantity, :productStatus, :description, :createdAt)", nativeQuery = true)
    int addProductToOrder(@Param("orderId") Long orderId, @Param("productId") Long productId,
            @Param("quantity") Integer quantity, @Param("productStatus") Integer productStatus,
            @Param("description") String description,@Param("createdAt") LocalDate createdAt);

    @Query("SELECT o, op FROM Order o JOIN o.orderProducts op WHERE o.customUser = :customUser")
    List<Object[]> findOrdersAndOrderProductsByCustomUser(@Param("customUser") CustomUser customUser);

    @Query(value = "SELECT p.id FROM order_products p WHERE p.product_id = :product_id AND p.id IN (:ids) LIMIT :quantity", nativeQuery = true)
    List<Integer> findLimitedIds(@Param("product_id") Integer product_id, @Param("ids") List<Integer> ids, @Param("quantity") Integer quantity);
    
    @Query(value = "SELECT p.created_at FROM order_products p WHERE p.id=id limit 1", nativeQuery = true)
    String findCreatetAt(@Param("id") Integer id);
    
    
    @Modifying
    @Transactional
    @Query("UPDATE OrderProducts p SET p.productStatus = :status, p.description = :description WHERE p.id IN (:ids)")
    void updateStatusAndDescription(@Param("status") Integer status, @Param("description") String description, @Param("ids") List<Integer> ids);
    
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :productId")
    void updateProductStock(@Param("productId") Integer productId, @Param("quantity") Integer quantity);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.id = :productId")
    void updateProductStockMinus(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    @Query("SELECT o, op FROM Order o JOIN o.orderProducts op")
    List<Object[]> findAllOrdersHistory();

    @Modifying
    @Transactional
    @Query("UPDATE OrderProducts p SET p.productStatus = :status WHERE p.id = :id")
    void updateStatus(@Param("status") Integer status, @Param("id") Integer id);

    @Query("SELECT p.stock FROM Product p WHERE p.product_id = :id")
     Integer findStockById(@Param("id") Long id);

}