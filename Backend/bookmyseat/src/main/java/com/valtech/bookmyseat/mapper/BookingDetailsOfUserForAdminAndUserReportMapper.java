package com.valtech.bookmyseat.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;

public class BookingDetailsOfUserForAdminAndUserReportMapper
		implements RowMapper<BookingDetailsOfUserForAdminAndUserReport> {

	@Override
	public BookingDetailsOfUserForAdminAndUserReport mapRow(ResultSet rs, int rowNum) throws SQLException {
		BookingDetailsOfUserForAdminAndUserReport bookingDetails = new BookingDetailsOfUserForAdminAndUserReport();
		bookingDetails.setUserName(rs.getString("user_name"));
		bookingDetails.setUserId(rs.getInt("user_id"));

		bookingDetails.setSeatNumber(rs.getInt("seat_number"));
		bookingDetails.setFloorName(rs.getString("floor_name"));
		bookingDetails.setStartTime(rs.getTime("start_time").toLocalTime());
		bookingDetails.setEndTime(rs.getTime("end_time").toLocalTime());
		bookingDetails.setStartDate(rs.getDate("start_date").toLocalDate());
		bookingDetails.setEndDate(rs.getDate("end_date").toLocalDate());
		bookingDetails.setBookingType(rs.getString("booking_type"));
		bookingDetails
				.setTeaCoffeeType(rs.getString("tea_coffee_type") != null ? rs.getString("tea_coffee_type") : null);
		bookingDetails.setParkingType(rs.getString("parking_type") != null ? rs.getString("parking_type") : null);
		bookingDetails.setLunch(rs.getBoolean("lunch"));
		bookingDetails.setBookingId(rs.getInt("booking_id"));
		bookingDetails.setBookingStatus(rs.getBoolean("booking_status"));
	
		return bookingDetails;
	}
}