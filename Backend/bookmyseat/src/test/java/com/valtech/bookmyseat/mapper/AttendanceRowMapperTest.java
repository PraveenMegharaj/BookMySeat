package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.entity.ApprovalStatus;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.BookingType;

@ExtendWith(MockitoExtension.class)
class AttendanceRowMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private AttendanceRowMapper attendanceRowMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("booking_id")).thenReturn(1);
		when(resultSet.getString("booking_type")).thenReturn("DAILY");
		when(resultSet.getDate("start_date")).thenReturn(java.sql.Date.valueOf(LocalDate.now()));
		when(resultSet.getDate("end_date")).thenReturn(java.sql.Date.valueOf(LocalDate.now()));
		when(resultSet.getBoolean("marked_status")).thenReturn(true);
		when(resultSet.getString("shift_name")).thenReturn("GENERAL");
		when(resultSet.getTime("start_time")).thenReturn(java.sql.Time.valueOf(LocalTime.now()));
		when(resultSet.getTime("end_time")).thenReturn(java.sql.Time.valueOf(LocalTime.now()));
		when(resultSet.getInt("seat_id")).thenReturn(1);
		when(resultSet.getInt("project_id")).thenReturn(1);
		when(resultSet.getString("project_name")).thenReturn("BOOKMYSEAT");
		when(resultSet.getInt("user_id")).thenReturn(1);
		when(resultSet.getString("first_name")).thenReturn("John");
		when(resultSet.getString("approval_status")).thenReturn("APPROVED");
		when(resultSet.getInt("location_id")).thenReturn(1);
		when(resultSet.getString("location_name")).thenReturn("BANGALORE");
		when(resultSet.getInt("floor_id")).thenReturn(0);
		when(resultSet.getString("floor_name")).thenReturn("GROUND_FLOOR");
		BookingMapping bookingMapping = attendanceRowMapper.mapRow(resultSet, 1);
		assertNotNull(bookingMapping);
		assertNotNull(bookingMapping.getBooking());
		assertNotNull(bookingMapping.getBooking().getSeat());
		assertNotNull(bookingMapping.getBooking().getShift());
		assertNotNull(bookingMapping.getBooking().getUser());
		assertEquals(1, bookingMapping.getBooking().getBookingId());
		assertEquals(BookingType.DAILY, bookingMapping.getBooking().getBookingType());
		assertNotNull(bookingMapping.getBooking().getStartDate());
		assertNotNull(bookingMapping.getBooking().getEndDate());
		assertTrue(bookingMapping.isMarkedStatus());
		assertEquals("GENERAL", bookingMapping.getBooking().getShift().getShiftName());
		assertNotNull(bookingMapping.getBooking().getShift().getStartTime());
		assertNotNull(bookingMapping.getBooking().getShift().getEndTime());
		assertEquals(1, bookingMapping.getBooking().getSeat().getSeatId());
		assertEquals(1, bookingMapping.getBooking().getUser().getUserId());
		assertEquals("John", bookingMapping.getBooking().getUser().getFirstName());
		assertEquals(ApprovalStatus.APPROVED, bookingMapping.getBooking().getUser().getApprovalStatus());
		assertEquals(1, bookingMapping.getBooking().getUser().getProject().getProjectId());
		assertEquals("BOOKMYSEAT", bookingMapping.getBooking().getUser().getProject().getProjectName());
		assertEquals(1, bookingMapping.getBooking().getUser().getProject().getProjectId());
	}
}
