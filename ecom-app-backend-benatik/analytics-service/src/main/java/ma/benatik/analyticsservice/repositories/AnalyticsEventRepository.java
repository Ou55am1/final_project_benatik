package ma.benatik.analyticsservice.repositories;

import ma.benatik.analyticsservice.entities.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {
}
