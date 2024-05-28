package com.example.todoappdeel3.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    private Long totalPrice;
    private String status;
    private LocalDate order_date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private CustomUser customUser;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderProducts> orderProducts;

    public Order() {

    }
    public Order(Long orderId) {
        this.orderId = orderId;}

    public CustomUser getCustomUser() {
        return customUser;
    }

    public void setCustomUser(CustomUser customUser) {
        this.customUser = customUser;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public String getStatus() {
        return status;
    }

    
    public void setTotalPrice(Long totalPrice) {
        this.totalPrice = totalPrice;
    }


    public Long gettotalPrice() {
        return totalPrice;
    }


    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getOrderDate() {
        return order_date;
    }

    public void setOrderDate(LocalDate order_date) {
        this.order_date = order_date;
    }


}
