package ma.benatik.supplierservice;

import ma.benatik.supplierservice.entities.Supplier;
import ma.benatik.supplierservice.repositories.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SupplierServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupplierServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(SupplierRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Supplier.builder().name("ACME Supplies").email("contact@acme.com").build());
                repository.save(Supplier.builder().name("NorthStar").email("sales@northstar.com").build());
            }
        };
    }
}
