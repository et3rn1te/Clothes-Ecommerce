package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.SendEmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
public class SendMailController {
    @Autowired
    SendEmailService sendEmailService;
    @Autowired
    AuthService authService;


    @PostMapping("/sendEmail")
    ApiResponse<Void> sendEmail(@RequestParam String email,@RequestParam String subject) throws ParseException, JOSEException, MessagingException {
        String token = authService.createVerifyToken(email);
        String result = "http://localhost:8080/api/auth/verifyEmail?token="+token;
       sendEmailService.sendMail(email,subject,result);
       return ApiResponse.<Void>builder().build();
    }
}
