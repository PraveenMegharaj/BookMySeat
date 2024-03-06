package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.ParkingType;
import com.valtech.bookmyseat.entity.TeaAndCoffee;

@ExtendWith(MockitoExtension.class)
class BookingMappingMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private BookingMappingMapper bookingMappingMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("id")).thenReturn(1);
		when(resultSet.getDate("booking_date")).thenReturn(Date.valueOf(LocalDate.now()));
		when(resultSet.getBoolean("additional_desktop")).thenReturn(true);
		when(resultSet.getBoolean("marked_status")).thenReturn(false);
		when(resultSet.getBoolean("lunch")).thenReturn(true);
		when(resultSet.getBoolean("tea_coffee")).thenReturn(false);
		when(resultSet.getBoolean("parking")).thenReturn(true);
		when(resultSet.getString("parking_type")).thenReturn("FOUR_WHEELER");
		when(resultSet.getString("tea_coffe_type")).thenReturn("TEA");
		when(resultSet.getInt("booking_id")).thenReturn(123);
		when(resultSet.getDate("start_date")).thenReturn(Date.valueOf(LocalDate.now()));
		when(resultSet.getDate("end_date")).thenReturn(Date.valueOf(LocalDate.now().plusDays(1)));
		BookingMapping bookingMapping = bookingMappingMapper.mapRow(resultSet, 1);
		assertNotNull(bookingMapping);
		assertEquals(1, bookingMapping.getId());
		assertEquals(LocalDate.now(), bookingMapping.getBookingDate());
		assertTrue(bookingMapping.isAdditionalDesktop());
		assertFalse(bookingMapping.isMarkedStatus());
		assertTrue(bookingMapping.isLunch());
		assertFalse(bookingMapping.isTeaCoffee());
		assertTrue(bookingMapping.isParking());
		assertEquals(ParkingType.FOUR_WHEELER, bookingMapping.getParkingType());
		assertEquals(TeaAndCoffee.TEA, bookingMapping.getTeaCoffeeType());
		Booking booking = bookingMapping.getBooking();
		assertNotNull(booking);
		assertEquals(123, booking.getBookingId());
		assertEquals(LocalDate.now(), booking.getStartDate());
		assertEquals(LocalDate.now().plusDays(1), booking.getEndDate());
	}
}
