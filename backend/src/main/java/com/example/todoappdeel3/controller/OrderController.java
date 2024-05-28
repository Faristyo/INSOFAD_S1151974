package com.example.todoappdeel3.controller;

import com.example.todoappdeel3.dao.OrderDAO;
import com.example.todoappdeel3.dao.ProductDAO;
import com.example.todoappdeel3.dto.OrderDTO;
import com.example.todoappdeel3.models.CustomUser;
import com.example.todoappdeel3.models.Order;
import com.example.todoappdeel3.services.OrderService;
import com.example.todoappdeel3.services.OrderServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private final OrderDAO orderDAO;

    private final OrderService orderService;

    public OrderController(OrderService orderService, OrderServiceImpl orderServiceImpl, OrderDAO orderDAO) {
        this.orderService = orderService;
        this.orderServiceImpl = orderServiceImpl;
        this.orderDAO = orderDAO;
    }

    private final OrderServiceImpl orderServiceImpl;

    @PostMapping()
    public ResponseEntity<?> placeOrder(@RequestBody OrderDTO orderDTO) {
        Object result = orderService.placeOrder(orderDTO);

        if (result instanceof Order) {
            Order order = (Order) result;
            return ResponseEntity.ok(order);
        } else if (result instanceof String) {
            String errorMessage = (String) result;
            return ResponseEntity.badRequest().body(errorMessage);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred.");
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Object[]>> getOrderHistory(@AuthenticationPrincipal CustomUser customUser) {
        List<Object[]> orders = orderDAO.getAllOrders();
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/return")
    public ResponseEntity<String> returnOrder(@RequestBody Object returnOrder) {
        String resultMessage = orderService.returnOrder(returnOrder);
        return ResponseEntity.ok(resultMessage);
    }

    @GetMapping("/allhistory")
    public ResponseEntity<List<Object[]>> getAllOrdersHistory(@AuthenticationPrincipal CustomUser customUser) {
        List<Object[]> orders = orderDAO.getAllOrdersHistory();
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/approve")
    public ResponseEntity<String> approveRequest(@RequestBody Object returnOrder) {
        orderService.approveRequest(returnOrder);
        return ResponseEntity.ok("Order returned successfully.");
    }

    @PostMapping("/reject")
    public ResponseEntity<String> rejectRequest(@RequestBody Object returnOrder) {
        orderService.rejectRequest(returnOrder);
        return ResponseEntity.ok("Order Not returnable.");
    }
}
