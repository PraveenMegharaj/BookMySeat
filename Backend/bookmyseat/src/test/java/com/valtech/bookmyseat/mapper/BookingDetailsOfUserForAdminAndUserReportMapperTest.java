package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;

@ExtendWith(MockitoExtension.class)
class BookingDetailsOfUserForAdminAndUserReportMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private BookingDetailsOfUserForAdminAndUserReportMapper bookingDetailsOfUserForAdminAndUserReportMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getString("user_name")).thenReturn("John Doe");
		when(resultSet.getInt("user_id")).thenReturn(123);
		when(resultSet.getInt("seat_number")).thenReturn(5);
		when(resultSet.getString("floor_name")).thenReturn("Main Floor");
		when(resultSet.getTime("start_time")).thenReturn(Time.valueOf("09:00:00"));
		when(resultSet.getTime("end_time")).thenReturn(Time.valueOf("17:00:00"));
		when(resultSet.getDate("start_date")).thenReturn(Date.valueOf("2024-02-25"));
		when(resultSet.getDate("end_date")).thenReturn(Date.valueOf("2024-02-25"));
		when(resultSet.getString("booking_type")).thenReturn("Meeting");
		when(resultSet.getString("tea_coffee_type")).thenReturn("Black Tea");
		when(resultSet.getString("parking_type")).thenReturn("Reserved");
		when(resultSet.getBoolean("lunch")).thenReturn(true);
		BookingDetailsOfUserForAdminAndUserReport result = bookingDetailsOfUserForAdminAndUserReportMapper
				.mapRow(resultSet, 1);
		assertEquals("John Doe", result.getUserName());
		assertEquals(123, result.getUserId());
		assertEquals(5, result.getSeatNumber());
		assertEquals("Main Floor", result.getFloorName());
		assertEquals(LocalTime.of(9, 0), result.getStartTime());
		assertEquals(LocalTime.of(17, 0), result.getEndTime());
		assertEquals(LocalDate.of(2024, 2, 25), result.getStartDate());
		assertEquals(LocalDate.of(2024, 2, 25), result.getEndDate());
		assertEquals("Meeting", result.getBookingType());
		assertEquals("Black Tea", result.getTeaCoffeeType());
		assertEquals("Reserved", result.getParkingType());
		assertEquals(true, result.isLunch());
	}
}
