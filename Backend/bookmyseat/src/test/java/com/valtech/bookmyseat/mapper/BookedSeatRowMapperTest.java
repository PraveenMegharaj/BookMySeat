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

import com.valtech.bookmyseat.model.BookedSeatModel;

@ExtendWith(MockitoExtension.class)
class BookedSeatRowMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private BookedSeatRowMapper bookedSeatRowMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getBoolean("booking_status")).thenReturn(true);
		when(resultSet.getDate("end_date")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 25)));
		when(resultSet.getDate("start_date")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 24)));
		when(resultSet.getInt("floor_id")).thenReturn(1);
		when(resultSet.getInt("seat_number")).thenReturn(5);
		when(resultSet.getInt("user_id")).thenReturn(1001);
		BookedSeatModel result = bookedSeatRowMapper.mapRow(resultSet, 1);
		assertEquals(true, result.isBookingStatus());
		assertEquals(LocalDate.of(2024, 2, 25), result.getEndDate());
		assertEquals(LocalDate.of(2024, 2, 24), result.getStartDate());
		assertEquals(1, result.getFloorId());
		assertEquals(5, result.getSeatNumber());
		assertEquals(1001, result.getUserId());
	}
}
