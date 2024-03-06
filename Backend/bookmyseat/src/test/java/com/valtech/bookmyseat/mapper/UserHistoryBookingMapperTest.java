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

import com.valtech.bookmyseat.model.UserBookingHistoryModel;

@ExtendWith(MockitoExtension.class)
class UserHistoryBookingMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private UserHistoryBookingMapper userHistoryBookingMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getDate("start_date")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 1)));
		when(resultSet.getDate("end_date")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 2)));
		when(resultSet.getString("booking_type")).thenReturn("Meeting");
		when(resultSet.getString("parking_type")).thenReturn(null);
		when(resultSet.getString("tea_coffee_type")).thenReturn("Black Coffee");
		when(resultSet.getBoolean("booking_status")).thenReturn(true);
		when(resultSet.getBoolean("additional_desktop")).thenReturn(false);
		when(resultSet.getBoolean("lunch")).thenReturn(true);
		when(resultSet.getInt("seat_id")).thenReturn(123);
		when(resultSet.getString("floor_name")).thenReturn("1st Floor");
		when(resultSet.getString("shift_name")).thenReturn("Morning Shift");
		when(resultSet.getTime("start_time")).thenReturn(Time.valueOf(LocalTime.of(9, 0)));
		when(resultSet.getTime("end_time")).thenReturn(Time.valueOf(LocalTime.of(17, 0)));
		UserBookingHistoryModel userBookingHistory = userHistoryBookingMapper.mapRow(resultSet, 1);
		assertEquals(LocalDate.of(2024, 2, 1), userBookingHistory.getStartDate());
		assertEquals(LocalDate.of(2024, 2, 2), userBookingHistory.getEndDate());
		assertEquals("Meeting", userBookingHistory.getBookingType());
		assertEquals(null, userBookingHistory.getParkingType());
		assertEquals("Black Coffee", userBookingHistory.getTeaCoffeeType());
		assertEquals(true, userBookingHistory.isBookingStatus());
		assertEquals(false, userBookingHistory.isAdditionalDesktop());
		assertEquals(true, userBookingHistory.isLunch());
		assertEquals(123, userBookingHistory.getSeatId());
		assertEquals("1st Floor", userBookingHistory.getFloorName());
		assertEquals("Morning Shift", userBookingHistory.getShiftName());
		assertEquals(LocalTime.of(9, 0), userBookingHistory.getStartTime());
		assertEquals(LocalTime.of(17, 0), userBookingHistory.getEndTime());
	}
}
