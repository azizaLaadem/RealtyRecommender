package org.ibtissam.monprojetjee.Repositories;


import org.ibtissam.monprojetjee.models.ERole;
import org.ibtissam.monprojetjee.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}