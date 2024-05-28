package com.example.todoappdeel3.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Calendar;
import java.util.Date;

@Component
public class JWTUtil {
    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(String email, String userId) throws IllegalArgumentException, JWTCreationException {

        return JWT.create()
                .withSubject("User Details")
                .withClaim("email", email)
                .withClaim("userId", userId) // Add id claim
                .withIssuedAt(new Date())
                .withExpiresAt(this.createExpirationDate())
                .withIssuer("Lina Xu")
                .sign(Algorithm.HMAC256(secret));
    }

    public String validateTokenAndRetrieveSubject(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User Details")
                .withIssuer("Lina Xu")
                .build();
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim("email").asString();
    }

    private Date createExpirationDate(){
        int expirationHours = 6;
        Calendar appendableDate = Calendar.getInstance();
        appendableDate.setTime(new Date());
        appendableDate.add(Calendar.HOUR, expirationHours);
        return appendableDate.getTime();
    }

    public String getUserIdFromToken() throws JWTVerificationException {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        @SuppressWarnings("null")
        HttpServletRequest request = attributes.getRequest();
        
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getClaim("userId").asString();
    }

}
