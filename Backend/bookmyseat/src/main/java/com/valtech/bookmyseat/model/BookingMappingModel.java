package com.valtech.bookmyseat.model;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class BookingMappingModel {
	private int id;
	private LocalDate bookedDate;
	private boolean attendance;
	private int bookingId;
}