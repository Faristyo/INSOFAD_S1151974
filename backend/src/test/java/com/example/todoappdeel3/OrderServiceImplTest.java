package com.example.todoappdeel3;

import com.example.todoappdeel3.config.JWTUtil;
import com.example.todoappdeel3.dao.OrderRepository;
import com.example.todoappdeel3.dao.ProductRepository;
import com.example.todoappdeel3.dao.CategoryRepository;
import com.example.todoappdeel3.dao.OrderDAO;
import com.example.todoappdeel3.dao.ProductDAO;
import com.example.todoappdeel3.dto.OrderDTO;
import com.example.todoappdeel3.dto.ProductDTO;
import com.example.todoappdeel3.models.Category;
import com.example.todoappdeel3.models.Order;
import com.example.todoappdeel3.models.Product;
import com.example.todoappdeel3.models.CustomUser;
import com.example.todoappdeel3.services.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private JWTUtil jwtUtil;

    @InjectMocks
    private OrderServiceImpl orderService;

    private ProductDAO productDAO;

    private OrderDAO orderDAO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        orderService = new OrderServiceImpl(orderRepository, productRepository, jwtUtil);
        productDAO = new ProductDAO(productRepository, categoryRepository);
        orderDAO = new OrderDAO(orderRepository, jwtUtil);
    }

    @Test
    public void testPlaceOrder_HappyFlow() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setStatus("NEW");
        orderDTO.setTotalPrice(100L);
        orderDTO.setOrderDate(LocalDate.now());
        Map<Long, Integer> productQuantities = new HashMap<>();
        productQuantities.put(1L, 2);
        orderDTO.setProductQuantities(productQuantities);

        Order order = new Order();
        order.setOrderId(1L);

        when(jwtUtil.getUserIdFromToken()).thenReturn("1");
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderRepository.findStockById(1L)).thenReturn(5);

        Object result = orderService.placeOrder(orderDTO);

        assertEquals(order, result);
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(orderRepository, times(1)).updateProductStockMinus(1L, 2);
    }

    @Test
    public void testAddItemToCart_InsufficientStock() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setStatus("NEW");
        orderDTO.setTotalPrice(100L);
        orderDTO.setOrderDate(LocalDate.now());
        Map<Long, Integer> productQuantities = new HashMap<>();
        productQuantities.put(1L, 10);  // Requesting more than available stock
        orderDTO.setProductQuantities(productQuantities);

        when(jwtUtil.getUserIdFromToken()).thenReturn("1");
        when(orderRepository.findStockById(1L)).thenReturn(5);  // Insufficient stock

        Object result = orderService.placeOrder(orderDTO);

        assertEquals("Stock not available for product with ID: 1", result);
        verify(orderRepository, never()).updateProductStockMinus(any(Long.class), any(Integer.class));
    }

    @Test
    public void testPlaceOrder_ExceptionFlow() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setStatus("NEW");
        orderDTO.setTotalPrice(100L);
        orderDTO.setOrderDate(LocalDate.now());
        Map<Long, Integer> productQuantities = new HashMap<>();
        productQuantities.put(1L, 2);
        orderDTO.setProductQuantities(productQuantities);

        when(jwtUtil.getUserIdFromToken()).thenThrow(new RuntimeException("JWT token exception"));
        when(orderRepository.findStockById(1L)).thenReturn(5);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            orderService.placeOrder(orderDTO);
        });

        assertEquals("JWT token exception", exception.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
        verify(orderRepository, never()).updateProductStockMinus(any(Long.class), any(Integer.class));
    }

    @Test
    public void testReturnOrder_HappyFlow() {
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("status", 1);
        orderData.put("product_id", 1);
        orderData.put("quantity", 2);
        orderData.put("ids", List.of(1, 2));
        orderData.put("description", "Returned");
        orderData.put("date", LocalDate.now().toString());

        when(orderRepository.findLimitedIds(anyInt(), anyList(), anyInt())).thenReturn(List.of(1, 2));

        String result = orderService.returnOrder(orderData);

        assertEquals("Order Completed", result);
        verify(orderRepository, times(1)).updateStatusAndDescription(anyInt(), anyString(), anyList());
    }

    @Test
    public void testReturnOrder_ExceptionFlow() {
        Map<String, Object> orderData = new HashMap<>();
        orderData.put("status", 1);
        orderData.put("product_id", 1);
        orderData.put("quantity", 2);
        orderData.put("ids", List.of(1, 2));
        orderData.put("description", "Returned");
        orderData.put("date", LocalDate.now().minusMonths(2).toString());

        String result = orderService.returnOrder(orderData);

        assertEquals("You can't return this product, return period expired", result);
        verify(orderRepository, never()).updateStatusAndDescription(anyInt(), anyString(), anyList());
    }

    @Test
    public void testSearchOrderById_NotExist() {
        Long orderId = 1L;
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        Optional<Order> result = orderService.searchOrderById(orderId);

        assertEquals(Optional.empty(), result);
    }

    @Test
    public void testUpdateProductStock_AddStock() {
        Long productId = 1L;
        int quantity = 5;

        doNothing().when(orderRepository).updateProductStock(productId.intValue(), quantity);

        orderService.updateProductStockPlus(Math.toIntExact(productId), quantity);

        verify(orderRepository, times(1)).updateProductStock(productId.intValue(), quantity);
    }

    @Test
    public void testUpdateProductStock_RemoveStock() {
        Long productId = 1L;
        int quantity = 5;

        doNothing().when(orderRepository).updateProductStockMinus(productId, quantity);

        orderService.updateProductStockMinus(productId, quantity);

        verify(orderRepository, times(1)).updateProductStockMinus(productId, quantity);
    }


    @Test
    public void shouldGetAllProducts() {
        List<Product> expectedProducts = List.of(new Product(), new Product());
        when(productRepository.findAll()).thenReturn(expectedProducts);

        List<Product> actualProducts = productDAO.getAllProducts();

        assertEquals(expectedProducts, actualProducts);
    }

    @Test
    public void shouldGetAllProductsByCategory_WhenCategoryExists() {
        List<Product> expectedProducts = List.of(new Product(), new Product());
        when(productRepository.findByCategoryId(1L)).thenReturn(Optional.of(expectedProducts));

        List<Product> actualProducts = productDAO.getAllProductsByCategory(1L);

        assertEquals(expectedProducts, actualProducts);
    }

    @Test
    public void shouldGetAllProductsByCategory_WhenCategoryDoesNotExist() {
        when(productRepository.findByCategoryId(1L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            productDAO.getAllProductsByCategory(1L);
        });
    }

    @Test
    public void shouldCreateProduct_WithValidCategory() {
        ProductDTO productDTO = new ProductDTO("name", "description", 100, "durability", "color", "fitting", "imageURL", "size", 10, 1L);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(new Category()));

        productDAO.createProduct(productDTO);

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    public void shouldCreateProduct_WithInvalidCategory() {
        ProductDTO productDTO = new ProductDTO("name", "description", 100, "durability", "color", "fitting", "imageURL", "size", 10, 1L);
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            productDAO.createProduct(productDTO);
        });
    }


    @Test
    public void shouldGetAllOrdersHistory() {
        List<Object[]> expectedOrdersHistory = List.of(new Object[]{}, new Object[]{});
        when(orderRepository.findAllOrdersHistory()).thenReturn(expectedOrdersHistory);

        List<Object[]> actualOrdersHistory = orderDAO.getAllOrdersHistory();

        assertEquals(expectedOrdersHistory, actualOrdersHistory);
    }
    @Test
    public void shouldSearchOrderByOrderId() {
        Long orderId = 1L;
        Order order = new Order();
        order.setOrderId(orderId);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        Optional<Order> result = orderRepository.findById(orderId);

        assertTrue(result.isPresent());
        assertEquals(orderId, result.get().getOrderId());
    }

    @Test
    public void shouldUpdateOrderStatus() {
        Long orderId = 1L;
        Order order = new Order();
        order.setOrderId(orderId);
        order.setStatus("NEW");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        order.setStatus("SHIPPED");
        orderRepository.save(order);

        verify(orderRepository, times(1)).save(order);
        assertEquals("SHIPPED", order.getStatus());
    }
    
    @Test
    public void shouldAcceptOrRejectReturn() {
        Long orderId = 1L;
        Order order = new Order();
        order.setOrderId(orderId);
        order.setStatus("Pending Return");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // Accept return
        order.setStatus("Return Accepted");
        orderRepository.save(order);
        verify(orderRepository, times(1)).save(order);
        assertEquals("Return Accepted", order.getStatus());

        // Reject return
        order.setStatus("Return Rejected");
        orderRepository.save(order);
        verify(orderRepository, times(2)).save(order);
        assertEquals("Return Rejected", order.getStatus());
    }



}
