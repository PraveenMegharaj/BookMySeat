package com.valtech.bookmyseat.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import com.valtech.bookmyseat.dao.BookingDAO;
import com.valtech.bookmyseat.dao.HolidayDAO;
import com.valtech.bookmyseat.dao.SeatDAO;
import com.valtech.bookmyseat.dao.ShiftDAO;
import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.entity.Shift;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.CustomDataAccessException;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.exception.SeatAlreadyBookedException;
import com.valtech.bookmyseat.model.BookedSeatModel;
import com.valtech.bookmyseat.model.BookingModel;
import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;
import com.valtech.bookmyseat.serviceimpl.BookingServiceImpl;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

	@Mock
	private BookingDAO bookingDAO;

	@Mock
	private SeatDAO seatDAO;

	@Mock
	private ShiftDAO shiftDAO;

	@Mock
	private HolidayDAO holidayDAO;

	@InjectMocks
	private BookingServiceImpl bookingService;

	@Test
	void testGetUserPreferredSeats_Success() {
		int floorId = 1;
		int projectId = 1;
		List<Booking> expectedSeats = new ArrayList<>();
		expectedSeats.add(new Booking());
		when(bookingDAO.userPreferredSeats(floorId, projectId)).thenReturn(expectedSeats);
		List<Booking> actualSeats = bookingService.getUserPreferredSeats(floorId, projectId);
		assertEquals(expectedSeats.size(), actualSeats.size());
	}

	@Test
	void testCustomDataAccessException() {
		int floorId = 1;
		int projectId = 2;
		when(bookingDAO.userPreferredSeats(floorId, projectId)).thenThrow(new DataAccessException("Test exception") {
			private static final long serialVersionUID = 1L;
		});
		assertThrows(CustomDataAccessException.class, () -> bookingService.getUserPreferredSeats(floorId, projectId));
	}

	@Test
	void testGetAllBookingDetails() {
		List<BookingMapping> expectedBookings = new ArrayList<>();
		doReturn(expectedBookings).when(bookingDAO).getAllBookingDetails();
		List<BookingMapping> result = bookingService.getAllBookingDetails();
		assertEquals(expectedBookings, result);
		verify(bookingDAO).getAllBookingDetails();
	}

	@Test
	void testApproveUserAttendance() {
		int userId = 123;
		bookingService.approveUserAttendance(userId);
		verify(bookingDAO).approvalAttendance(userId);
	}

	@Test
	void testApproveUserAttendance_DataAccessException() {
		int userId = 123;
		doThrow(new DataAccessException("Test Exception") {
			static final long serialVersionUID = 1L;
		}).when(bookingDAO).approvalAttendance(userId);
		assertThrows(CustomDataAccessException.class, () -> bookingService.approveUserAttendance(userId));
	}

	@Test
	void testCreateBooking_Success() throws Exception {
		BookingModel booking = new BookingModel();
		booking.setSeatNumber(123);
		booking.setFloorId(1);
		booking.setShiftId(456);
		booking.setStartDate(LocalDate.of(2024, Month.FEBRUARY, 25));
		booking.setEndDate(LocalDate.of(2024, Month.FEBRUARY, 28));
		User user = new User();
		user.setUserId(789);
		Seat seat = new Seat();
		seat.setSeatId(123);
		Shift shift = new Shift();
		shift.setShiftId(456);
		when(seatDAO.findSeatById(123, 1)).thenReturn(seat);
		when(shiftDAO.findShiftByShiftId(456)).thenReturn(shift);
		when(bookingDAO.createBooking(booking, user, seat, shift)).thenReturn(1);
		int bookingId = bookingService.createBooking(booking, user);
		assertEquals(1, bookingId);
		verify(bookingDAO, times(1)).createBooking(booking, user, seat, shift);
	}

	@Test
	void testHasAlreadyBookedForDateCheck_RuntimeException() throws Exception {
		int userId = 123;
		LocalDate startDate = LocalDate.of(2024, Month.FEBRUARY, 25);
		LocalDate endDate = LocalDate.of(2024, Month.FEBRUARY, 28);
		when(bookingDAO.hasAlreadyBookedForDate(userId, startDate, endDate)).thenThrow(new RuntimeException());
		assertThrows(DataBaseAccessException.class,
				() -> bookingService.hasAlreadyBookedForDateCheck(userId, startDate, endDate));
	}

	@Test
	void testCreateBooking_SeatAlreadyBookedException() throws DataBaseAccessException {
		BookingModel booking = new BookingModel();
		User user = new User();
		user.setUserId(1);
		booking.setUserId(user.getUserId());
		booking.setSeatNumber(123);
		booking.setFloorId(1);
		booking.setShiftId(456);
		booking.setStartDate(LocalDate.now());
		booking.setEndDate(LocalDate.now());
		SeatAlreadyBookedException expectedException = new SeatAlreadyBookedException(
				"You have already booked for this date range.");
		when(seatDAO.findSeatById(booking.getSeatNumber(), booking.getFloorId())).thenReturn(new Seat());
		when(shiftDAO.findShiftByShiftId(booking.getShiftId())).thenReturn(new Shift());
		when(bookingDAO.hasAlreadyBookedForDate(user.getUserId(), booking.getStartDate(), booking.getEndDate()))
				.thenReturn(true);
		Throwable exception = assertThrows(SeatAlreadyBookedException.class,
				() -> bookingService.createBooking(booking, user));
		assertEquals(expectedException.getMessage(), exception.getMessage());
	}

	@Test
	void testCreateBookingMapping() {
		BookingModel booking = new BookingModel();
		booking.setStartDate(LocalDate.of(2024, 3, 1));
		booking.setEndDate(LocalDate.of(2024, 3, 5));
		int bookingId = 123;
		bookingService.createBookingMapping(booking, bookingId);
		verify(bookingDAO, times(5)).createBookingMapping(any(BookingModel.class), eq(bookingId));
	}

	@Test
	void testGetAllBookedSeat() throws DataBaseAccessException {
		List<BookedSeatModel> mockedBookedSeats = new ArrayList<>();
		mockedBookedSeats.add(new BookedSeatModel());
		LocalDate startDate = LocalDate.of(2024, 1, 1);
		LocalDate endDate = LocalDate.of(2024, 1, 31);
		when(bookingDAO.getAllBookedSeat(startDate, endDate)).thenReturn(mockedBookedSeats);
		List<BookedSeatModel> result = bookingService.getAllBookedSeat(startDate, endDate);
		verify(bookingDAO).getAllBookedSeat(startDate, endDate);
		assertEquals(mockedBookedSeats, result);
	}

	@Test
	void testGetAllBookedSeat_ExceptionThrown() {
		LocalDate startDate = LocalDate.of(2024, 1, 1);
		LocalDate endDate = LocalDate.of(2024, 1, 31);
		when(bookingDAO.getAllBookedSeat(startDate, endDate)).thenReturn(null);
		assertThrows(DataBaseAccessException.class, () -> bookingService.getAllBookedSeat(startDate, endDate));
	}

	@Test
	void testGetRestrainReservedDetailsOfUsers() {
		List<RestrainReserveOfUsersModel> testData = Arrays.asList(new RestrainReserveOfUsersModel(),
				new RestrainReserveOfUsersModel());
		when(bookingDAO.getReservedRestrainDetailsOfUsers()).thenReturn(testData);
		List<RestrainReserveOfUsersModel> result = bookingService.getRestrainReservedDetailsOfUsers();
		assertEquals(testData, result, "Returned data does not match expected data");
		verify(bookingDAO, times(1)).getReservedRestrainDetailsOfUsers();
	}
}
