package com.valtech.bookmyseat.model;

import java.util.List;

import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.Seat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@NoArgsConstructor
@ToString
@Getter
public class SeatBookingResponse {
	List<Seat> seats;
	List<Booking> preferredSeats;
}