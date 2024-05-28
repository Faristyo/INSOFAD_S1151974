package com.example.todoappdeel3.dao;


import com.example.todoappdeel3.models.CustomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<CustomUser, Long> {
    CustomUser findByEmail(String email);
}
