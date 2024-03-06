package com.valtech.bookmyseat.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Holiday {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int holidayId;

	@Column(nullable = false, length = 30)
	private String holidayName;

	@Column(nullable = false)
	private LocalDate holidayDate;

	@Column(nullable = false, length = 30)
	private String holidayMonth;
}