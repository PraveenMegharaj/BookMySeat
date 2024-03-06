package com.valtech.bookmyseat.model;

import lombok.Getter;

@Getter
public class SeatModel {
	private int seatId;
	private boolean seatStatus;
	private int floorId;
	private int reservedId;
}