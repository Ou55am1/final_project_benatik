package ma.benatik.analyticsservice;

import ma.benatik.analyticsservice.entities.AnalyticsEvent;
import ma.benatik.analyticsservice.repositories.AnalyticsEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.Instant;
import java.util.function.Consumer;

@SpringBootApplication
public class AnalyticsServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsServiceApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(AnalyticsEventRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(AnalyticsEvent.builder()
                        .type("startup")
                        .payload("analytics-service booted")
                        .createdAt(Instant.now())
                        .build());
            }
        };
    }

    @Bean
    public Consumer<OrderEvent> analyticsConsumer(AnalyticsEventRepository repository) {
        return event -> {
            log.info("Analytics received order event billId={} customerId={} at {}", event.billId(), event.customerId(),
                    event.createdAt());
            repository.save(AnalyticsEvent.builder()
                    .type("order")
                    .payload("billId=" + event.billId() + ", customerId=" + event.customerId())
                    .createdAt(event.createdAt())
                    .build());
        };
    }

    public record OrderEvent(Long billId, Long customerId, Instant createdAt) {
    }
}
