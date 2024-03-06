package com.valtech.bookmyseat.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.valtech.bookmyseat.serviceimpl.CustomUserDetailServiceImpl;

@Configuration
public class SecurityConfiguration {

	private static final int PASSWORD_ENCODER_STRENGTH = 12;
	@Autowired
	private CustomUserDetailServiceImpl customUserDetailServiceImpl;

	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(PASSWORD_ENCODER_STRENGTH);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter authenticationFilter,
			JwtAuthenticationEntryPoint authenticationEntryPoint) throws Exception {
		http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(authorize -> { 
			authorize.requestMatchers("/bookmyseat/login", "/bookmyseat/registration", "/bookmyseat/admin/createuser",
					"/bookmyseat/admin/location", "/bookmyseat/admin/user-seat-info","/bookmyseat/user/forgot-password","/bookmyseat/user/verify-otp/{userId}","/bookmyseat/user/reset-password/{userId}").permitAll();
			authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
			authorize.anyRequest().authenticated();
		}).httpBasic(Customizer.withDefaults());
		http.exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint));
		http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Autowired
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(customUserDetailServiceImpl).passwordEncoder(passwordEncoder());
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
}