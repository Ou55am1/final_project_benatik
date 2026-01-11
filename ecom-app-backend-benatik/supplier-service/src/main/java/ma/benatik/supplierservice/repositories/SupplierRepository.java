package ma.benatik.supplierservice.repositories;

import ma.benatik.supplierservice.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
