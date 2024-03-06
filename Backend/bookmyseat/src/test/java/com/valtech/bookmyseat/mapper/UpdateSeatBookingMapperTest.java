package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.model.UserModifyCancelSeat;

@ExtendWith(MockitoExtension.class)
class UpdateSeatBookingMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private UpdateSeatBookingMapper updateSeatBookingMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("userId")).thenReturn(1);
		when(resultSet.getString("userName")).thenReturn("John Doe");
		when(resultSet.getDate("booking_startDate")).thenReturn(Date.valueOf(LocalDate.now()));
		when(resultSet.getDate("booking_endDate")).thenReturn(Date.valueOf(LocalDate.now().plusDays(1)));
		when(resultSet.getString("shiftName")).thenReturn("Morning");
		when(resultSet.getInt("seatNumber")).thenReturn(10);
		when(resultSet.getString("floorName")).thenReturn("Ground");
		when(resultSet.getBoolean("bookingStatus")).thenReturn(true);
		when(resultSet.getString("userEmail")).thenReturn("john.doe@example.com");
		UserModifyCancelSeat result = updateSeatBookingMapper.mapRow(resultSet, 1);
		assertEquals(1, result.getUserId());
		assertEquals("John Doe", result.getUserName());
		assertEquals(LocalDate.now(), result.getBookingStartDate());
		assertEquals(LocalDate.now().plusDays(1), result.getBookingEndDate());
		assertEquals("Morning", result.getShiftName());
		assertEquals(10, result.getSeatNumber());
		assertEquals("Ground", result.getFloorName());
		assertEquals(true, result.isBookingStatus());
		assertEquals("john.doe@example.com", result.getUserEmail());
	}
}
