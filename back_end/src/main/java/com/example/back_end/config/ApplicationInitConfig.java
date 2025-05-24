package com.example.back_end.config;

import com.example.back_end.constant.PredefinedPayment;
import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.entity.PaymentMethod;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.repository.DiscountRepository;
import com.example.back_end.repository.PaymentRepository;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "Tam123456@";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PaymentRepository paymentRepository, DiscountRepository discountRepository) {
        log.info("Initializing application.....");
        return args -> {
            if (!paymentRepository.existsPaymentMethodByTypePayment(PredefinedPayment.COD)) {
                paymentRepository.save(PaymentMethod.builder()
                        .typePayment(PredefinedPayment.COD)
                        .build());
            }

            if (!paymentRepository.existsPaymentMethodByTypePayment(PredefinedPayment.VN_PAY)) {
                paymentRepository.save(PaymentMethod.builder()
                        .typePayment(PredefinedPayment.VN_PAY)
                        .build());
            }
            if (userRepository.existsByUsername(ADMIN_USER_NAME) != true) {
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .email("tamle7723@gmail.com")
                        .fullname(ADMIN_USER_NAME)
                        .phone("0911281672")
                        .active(true)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
