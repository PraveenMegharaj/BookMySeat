package com.valtech.bookmyseat.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestrainReserveOfUsersModel {
	private int userId;
	private int reservedId;
	private boolean reservedStatus;
	private int seatNumber;
	private int floorId;
}