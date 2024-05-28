package com.example.todoappdeel3.services;


import com.example.todoappdeel3.dto.OrderDTO;
import com.example.todoappdeel3.models.Order;


public interface OrderService {
    Object placeOrder(OrderDTO orderDTO);
    String returnOrder(Object orderDTO);
    String approveRequest(Object orderDTO);
    String rejectRequest(Object orderDTO);
}
