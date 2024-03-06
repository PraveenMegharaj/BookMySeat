package com.valtech.bookmyseat.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserModifyCancelSeat {
	private int userId;
	private String userName;
	private LocalDate bookingStartDate;
	private LocalDate bookingEndDate;
	private String shiftName;
	private int seatNumber;
	private String floorName;
	private boolean bookingStatus;
	private String userEmail;
}
