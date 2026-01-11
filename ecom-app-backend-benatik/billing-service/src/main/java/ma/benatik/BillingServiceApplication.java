package ma.benatik;

import ma.benatik.billingservice.entities.Bill;
import ma.benatik.billingservice.entities.ProductItem;
import ma.benatik.billingservice.feign.CustomerRestClient;
import ma.benatik.billingservice.feign.ProductRestClient;
import ma.benatik.billingservice.model.Customer;
import ma.benatik.billingservice.model.Product;
import ma.benatik.billingservice.repository.BillRepository;
import ma.benatik.billingservice.repository.ProductItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.Random;

@SpringBootApplication
@EnableFeignClients
public class BillingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(BillRepository billRepository,
            ProductItemRepository productItemRepository,
            CustomerRestClient customerRestClient,
            ProductRestClient productRestClient,
            StreamBridge streamBridge) {

        return args -> {
            Collection<Customer> customers = customerRestClient.getAllCustomers().getContent();
            Collection<Product> products = productRestClient.getAllProducts().getContent();

            customers.forEach(customer -> {
                Bill bill = Bill.builder()
                        .billingDate(new Date())
                        .customerId(customer.getId())
                        .build();
                billRepository.save(bill);
                products.forEach(product -> {
                    ProductItem productItem = ProductItem.builder()
                            .bill(bill)
                            .productId(product.getId())
                            .quantity(1 + new Random().nextInt(10))
                            .unitPrice(product.getPrice())
                            .build();
                    productItemRepository.save(productItem);
                });
                streamBridge.send("billing-out-0", new OrderEvent(bill.getId(), bill.getCustomerId(), Instant.now()));
            });
        };
    }

    public record OrderEvent(Long billId, Long customerId, Instant createdAt) {
    }

}
