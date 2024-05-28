package com.example.todoappdeel3.services;

import com.example.todoappdeel3.dao.OrderRepository;
import com.example.todoappdeel3.dao.ProductRepository;
import com.example.todoappdeel3.dto.OrderDTO;
import com.example.todoappdeel3.models.CustomUser;
import com.example.todoappdeel3.models.Order;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todoappdeel3.config.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;


    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository, JWTUtil jwtUtil) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.jwtUtil = jwtUtil;
    }


    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public Object placeOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setStatus(orderDTO.getStatus());
        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setOrderDate(orderDTO.getOrderDate());
        String userId = jwtUtil.getUserIdFromToken();
        CustomUser customUser = new CustomUser();
        customUser.setId(Long.parseLong(userId));
        order.setCustomUser(customUser);
        Order savedOrder = orderRepository.save(order);
        // Store product quantities in the product_order table
        Map<Long, Integer> productQuantities = orderDTO.getProductQuantities();
        for (Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();
            Integer stock = orderRepository.findStockById(productId);
            if (stock != null && stock >=quantity) {
                for (int i = 0; i < quantity; i++) {
                    orderRepository.addProductToOrder(
                        savedOrder.getOrderId(), 
                        productId, 
                        1, // Always 1 for each individual call
                        1, 
                        "request", 
                        LocalDate.now()
                    );  
                }              
            orderRepository.updateProductStockMinus(productId, quantity);
            } else {
                return ("Stock not available for product with ID: " + productId);
            }
        }
        return savedOrder;
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public String returnOrder(Object order) {
        Map<String, Object> orderData = (Map<String, Object>) order;
        Integer status = (Integer) orderData.get("status");
        Integer product_id = (Integer) orderData.get("product_id");
        Integer quantity = (Integer) orderData.get("quantity");
        List<Integer> multipleIds = (List<Integer>) orderData.get("ids");
        String description = (String) orderData.get("description");
        LocalDate providedDate = LocalDate.now();

        List<Integer> limitedIds = orderRepository.findLimitedIds(product_id, multipleIds, quantity);
        if (!limitedIds.isEmpty()) {
            System.out.println(limitedIds.get(0));
            String createdAtStr = orderRepository.findCreatetAt(limitedIds.get(0));
            LocalDate createdAt = LocalDate.parse(createdAtStr);
            if (!providedDate.isAfter(createdAt.plusMonths(1))) {
                orderRepository.updateStatusAndDescription(status, description, limitedIds);
                return "Order Completed";
            } else {
                return "You can't return this product, return period expired";
            }
        } else {
            return "No IDs found.";
        }
    }


    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public String approveRequest(Object order) {
        Map<String, Object> orderData = (Map<String, Object>) order;
        Integer status = (Integer) orderData.get("status");
        Integer id = (Integer) orderData.get("id");
        Integer productId = (Integer) orderData.get("productId");
        Integer quantity = (Integer) orderData.get("quantity");

        orderRepository.updateProductStock(productId, quantity);
        orderRepository.updateStatus(status, id);
        return "Order Completed";
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public String rejectRequest(Object order) {
        Map<String, Object> orderData = (Map<String, Object>) order;
        Integer status = (Integer) orderData.get("status");
        Integer id = (Integer) orderData.get("id");
        orderRepository.updateStatus(status, id);
        return "Order Completed";
    }
    public Optional<Order> searchOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    public void updateProductStockPlus(Integer productId, int quantity) {
        orderRepository.updateProductStock(productId, quantity);
    }
    public void updateProductStockMinus(Long productId, int quantity) {
        orderRepository.updateProductStockMinus(productId, quantity);
    }


}

