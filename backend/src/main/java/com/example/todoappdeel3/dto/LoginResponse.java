package com.example.todoappdeel3.dto;

public class LoginResponse {
    public String email;
    public String token;
    public String role;

    public LoginResponse(String email, String token, String role) {
        this.email = email;
        this.token = token;
        this.role = role;
    }
}
