package com.example.todoappdeel3.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;


@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long product_id;
    private String name;
    private Number price;
    private String description;
    private String durability;
    private String color;
    private String fitting;
    private String imageURL;
    private String size;
    private Integer stock;
    private boolean isFinished = false;
     /*
    Maps the many-to-one relationship between product and category, jsonbackreference so that we do not get an
    infinite dependency loop in the request. Cascasdetype merge so the product is able to create a category if we
    seed the data to the database. Without the merge you get a persistence race condition.
    */
    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private Category category;

    //needed by JPA to create the entity must be present no arg constructor
    public Product(String name, String description, Number price, Category category, String durability, String color, String fitting, String imageURL, String size, Integer stock) {
    }
    public Product() {

    }

    public Product(String name, String description, double price, Category category, String durability, String color, String fitting, String imageURL, String size, int stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.color = color;
        this.category = category;
        this.durability = durability;
        this.fitting = fitting;
        this.imageURL = imageURL;
        this.size = size;
        this.stock = stock;
        this.isFinished = false;
    }

    //getters and setters are needed to map all the properties to the database by JPA, could
    //also be solved by making the properties public but gives less control over the properties.
    public Category getCategory() {
        return category;
    }

    public String getDurability() {
        return durability;
    }

    public void setDurability(String durability) {
        this.durability = durability;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getFitting() {
        return fitting;
    }

    public void setFitting(String fitting) {
        this.fitting = fitting;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public long getId() {
        return product_id;
    }

    public void setId(long id) {
        this.product_id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Number getPrice() { return price; }

    public void setPrice(Number price) { this.price = price; }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isFinished() {
        return isFinished;
    }

    public void setFinished(boolean finished) {
        isFinished = finished;
    }
}
