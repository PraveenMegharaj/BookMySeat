package com.valtech.bookmyseat.model;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDetailsOfUserForAdminAndUserReport {
	private String userName;
	private int userId;
	private int seatNumber;
	private String floorName;
	private LocalTime startTime;
	private LocalTime endTime;
	private LocalDate startDate;
	private LocalDate endDate;
	private String bookingType;
	private String teaCoffeeType;
	private String parkingType;
	private boolean lunch;
	private int bookingId;
	private boolean bookingStatus;
}
