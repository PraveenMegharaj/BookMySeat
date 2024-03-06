package com.valtech.bookmyseat.exception;

import java.sql.SQLException;

public class SeatAlreadyBookedException extends SQLException {
	private static final long serialVersionUID = 1L;

	public SeatAlreadyBookedException(String msg) {
		super(msg);
	}
}