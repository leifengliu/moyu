package com.moyucoffee;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.moyucoffee.module.**.mapper")
@EnableScheduling
public class MoyuCoffeeApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoyuCoffeeApplication.class, args);
    }
}
