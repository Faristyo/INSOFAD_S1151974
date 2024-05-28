package com.example.todoappdeel3.utils;


import com.example.todoappdeel3.dao.CategoryDAO;
import com.example.todoappdeel3.dao.OrderRepository;
import com.example.todoappdeel3.dao.ProductDAO;
import com.example.todoappdeel3.dao.UserRepository;
import com.example.todoappdeel3.models.Category;
import com.example.todoappdeel3.models.CustomUser;
import com.example.todoappdeel3.models.Product;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class Seeder {
    private final ProductDAO productDAO;
    private final UserRepository userRepository;
    private final CategoryDAO categoryDAO;
    private final OrderRepository orderRepository;

    public Seeder(ProductDAO productDAO, UserRepository userRepository, CategoryDAO categoryDAO, OrderRepository orderRepository) {
        this.productDAO = productDAO;
        this.userRepository = userRepository;
        this.categoryDAO = categoryDAO;
        this.orderRepository = orderRepository;
    }

    @EventListener
    public void seed(ContextRefreshedEvent event){
        this.seedProducts();
        this.seedUser();
    }

    private void seedProducts(){
        // Luxe categorieën aanhouden
        Category categoryHoodies = new Category("Luxury Hoodies");
        Category categoryPants = new Category("Designer Pants");
        Category categoryAccessories = new Category("Exclusive Accessories");
        Category categoryCapsAndBeanies = new Category("Designer Headwear");
        Category categoryOuterwear = new Category("Premium Outerwear");

// Luxe producten definiëren
        Product product1 = new Product("Cashmere Hoodie", "Crafted from 100% pure cashmere, this hoodie offers unparalleled softness and warmth, ideal for those who seek both comfort and luxury.", 400.00, categoryHoodies, "A+", "Black", "Tailored Fit", "imageURL", "One-size", 5);
        Product product2 = new Product("Silk Hoodie", "Experience the smooth touch of pure silk with this hoodie, combining casual design with luxury fabric for a sophisticated, relaxed look.", 350.00, categoryHoodies, "A++", "Blue", "Tailored Fit", "imageURL", "One-size", 7);
        Product product11 = new Product("White Wool Hoodie", "Made from fine wool, this white hoodie blends comfort with elegance, perfect for a subtle, stylish statement.", 320.00, categoryHoodies, "A++", "White", "Tailored Fit", "imageURL", "One-size", 8);

        Product product3 = new Product("Italian Leather Pants", "Tailored from premium Italian leather, these pants offer a perfect blend of luxury and durability, tailored for the fashion-forward.", 700.00, categoryPants, "A+", "Black", "Slim Fit", "imageURL", "One-size", 1);
        Product product4 = new Product("Suede Cargo Pants", "Elevate your style with these soft suede cargo pants, offering both comfort and a bold fashion statement.", 650.00, categoryPants, "A+", "Sand", "Relaxed Fit", "imageURL", "One-size", 3);
        Product product12 = new Product("Velvet Parachute Pants", "These parachute pants crafted from premium velvet redefine luxury in streetwear with their unique texture and comfort.", 600.00, categoryPants, "A++", "Burgundy", "Over-sized", "imageURL", "One-size", 7);

        Product product5 = new Product("Leather Satchel Bag", "Handcrafted from the finest leather, this satchel is a masterpiece of luxury accessories, perfect for the discerning individual.", 950.00, categoryAccessories, "A+", "Tan", "30cm x 35cm", "imageURL", "One-size", 1);
        Product product6 = new Product("Exotic Skin Clutch Bag", "This clutch made from exotic animal skin stands out as a symbol of luxury and exclusivity, perfect for high-class events.", 1100.00, categoryAccessories, "A+", "Oxblood", "25cm x 15cm", "imageURL", "One-size", 1);
        Product product13 = new Product("Gold-Plated Keychain", "A stunning gold-plated keychain that combines utility with opulence, making it an essential luxury for everyday elegance.", 200.00, categoryAccessories, "A+", "Gold", "8cm", "imageURL", "One-size", 7);

        Product product7 = new Product("Merino Wool Beanie", "Crafted from 100% merino wool, this beanie provides exceptional warmth and style, making it a must-have accessory for any luxury wardrobe.", 120.00, categoryCapsAndBeanies, "A++", "Charcoal", "Fitted", "imageURL", "One-size", 2);
        Product product8 = new Product("Cashmere Flat Cap", "Made from soft cashmere, this flat cap offers a timeless look with luxurious comfort, perfect for stylish outdoor adventures.", 150.00, categoryCapsAndBeanies, "A++", "Beige", "Fitted", "imageURL", "One-size", 5);
        Product product14 = new Product("Silk Bucket Hat", "This silk bucket hat combines casual style with a touch of luxury, ideal for those who appreciate fine fabrics and contemporary design.", 180.00, categoryCapsAndBeanies, "A++", "Navy", "Fitted", "imageURL", "One-size", 8);


        this.productDAO.createProduct(product1);
        this.productDAO.createProduct(product2);
        this.productDAO.createProduct(product3);
        this.productDAO.createProduct(product4);
        this.productDAO.createProduct(product5);
        this.productDAO.createProduct(product6);
        this.productDAO.createProduct(product7);
        this.productDAO.createProduct(product8);
        this.productDAO.createProduct(product11);
        this.productDAO.createProduct(product12);
        this.productDAO.createProduct(product13);
        this.productDAO.createProduct(product14);

        this.categoryDAO.createCategory(categoryHoodies);
        this.categoryDAO.createCategory(categoryPants);
        this.categoryDAO.createCategory(categoryAccessories);
        this.categoryDAO.createCategory(categoryCapsAndBeanies);
        this.categoryDAO.createCategory(categoryOuterwear);
    }

    private void seedUser(){
        try{
            CustomUser customUser = new CustomUser();
            customUser.setEmail("bob@bobsluxuryenterprise.com");
            customUser.setPassword(new BCryptPasswordEncoder().encode("IreallyL0vePupp1es!"));
            customUser.setRole("1");
            userRepository.save(customUser);
        }catch(Exception e){}

        
        try{
            CustomUser customUserAdmin = new CustomUser();
            customUserAdmin.setEmail("admin@gmail.com");
            customUserAdmin.setPassword(new BCryptPasswordEncoder().encode("Admin@123!fwefewfFEF!fhtrh"));
            customUserAdmin.setRole("2");
            userRepository.save(customUserAdmin);
        }catch(Exception e){}
    }


}
