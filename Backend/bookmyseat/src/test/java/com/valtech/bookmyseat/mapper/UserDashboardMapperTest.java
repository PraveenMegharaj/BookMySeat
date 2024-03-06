package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.entity.Shift;
import com.valtech.bookmyseat.entity.TeaAndCoffee;

@ExtendWith(MockitoExtension.class)
class UserDashboardMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private UserDashboardMapper userDashboardMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("booking_id")).thenReturn(1);
		when(resultSet.getDate("start_date")).thenReturn(Date.valueOf(LocalDate.of(2022, 1, 1)));
		when(resultSet.getDate("end_date")).thenReturn(Date.valueOf(LocalDate.of(2022, 1, 3)));
		when(resultSet.getString("shift_name")).thenReturn("Morning");
		when(resultSet.getTime("start_time")).thenReturn(Time.valueOf(LocalTime.of(8, 0)));
		when(resultSet.getTime("end_time")).thenReturn(Time.valueOf(LocalTime.of(12, 0)));
		when(resultSet.getInt("seat_id")).thenReturn(123);
		when(resultSet.getInt("floor_id")).thenReturn(1);
		when(resultSet.getString("floor_name")).thenReturn("Floor 1");
		when(resultSet.getBoolean("lunch")).thenReturn(true);
		when(resultSet.getBoolean("tea_coffee")).thenReturn(true);
		when(resultSet.getString("tea_coffee_type")).thenReturn("COFFEE");
		BookingMapping bookingMapping = userDashboardMapper.mapRow(resultSet, 1);
		assertNotNull(bookingMapping);
		assertEquals(1, bookingMapping.getBooking().getBookingId());
		assertEquals(LocalDate.of(2022, 1, 1), bookingMapping.getBooking().getStartDate());
		assertEquals(LocalDate.of(2022, 1, 3), bookingMapping.getBooking().getEndDate());
		Shift shift = bookingMapping.getBooking().getShift();
		assertNotNull(shift);
		assertEquals("Morning", shift.getShiftName());
		assertEquals(LocalTime.of(8, 0), shift.getStartTime());
		assertEquals(LocalTime.of(12, 0), shift.getEndTime());
		Seat seat = bookingMapping.getBooking().getSeat();
		assertNotNull(seat);
		assertEquals(123, seat.getSeatId());
		Floor floor = seat.getFloor();
		assertNotNull(floor);
		assertEquals(1, floor.getFloorId());
		assertEquals("Floor 1", floor.getFloorName());
		assertTrue(bookingMapping.isLunch());
		assertTrue(bookingMapping.isTeaCoffee());
		assertEquals(TeaAndCoffee.COFFEE, bookingMapping.getTeaCoffeeType());
	}
}
