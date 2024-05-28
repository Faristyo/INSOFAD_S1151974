package com.example.todoappdeel3.dao;


import com.example.todoappdeel3.config.JWTUtil;
import com.example.todoappdeel3.models.CustomUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class OrderDAO {

        @Autowired
    private JWTUtil jwtUtil;

    private final OrderRepository orderRepository;

    public OrderDAO(OrderRepository orderRepository, JWTUtil jwtUtil) {
        this.orderRepository = orderRepository;
    }

    public List<Object[]> getAllOrders(){
           String userId = jwtUtil.getUserIdFromToken();
        if (userId == null) {
            return Collections.emptyList();
        }
          CustomUser customUser = new CustomUser();
        customUser.setId(Long.parseLong(userId));
        return this.orderRepository.findOrdersAndOrderProductsByCustomUser(customUser);
    }

    public List<Object[]> getAllOrdersHistory(){
     return this.orderRepository.findAllOrdersHistory();
 }
}
