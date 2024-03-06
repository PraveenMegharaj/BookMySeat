package com.valtech.bookmyseat.daoimpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.valtech.bookmyseat.dao.UserDAO;
import com.valtech.bookmyseat.daoimpl.BookingDAOImpl.BookingRowMapper;
import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.BookingType;
import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.entity.Shift;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.mapper.AttendanceRowMapper;
import com.valtech.bookmyseat.mapper.BookedSeatRowMapper;
import com.valtech.bookmyseat.mapper.ReservedAndRestrainOfUserMapper;
import com.valtech.bookmyseat.model.BookedSeatModel;
import com.valtech.bookmyseat.model.BookingModel;
import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;

@ExtendWith(MockitoExtension.class)
class BookingDAOImplTest {

	@Mock
	private ResultSet resultSet;

	@Mock
	private UserDAO userDAO;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@InjectMocks
	private BookingDAOImpl bookingDAOImpl;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("BOOKING_ID")).thenReturn(1);
		when(resultSet.getDate("START_DATE")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 1)));
		when(resultSet.getDate("END_DATE")).thenReturn(Date.valueOf(LocalDate.of(2024, 2, 5)));
		when(resultSet.getString("BOOKING_TYPE")).thenReturn("DAILY");
		when(resultSet.getBoolean("BOOKING_STATUS")).thenReturn(true);
		when(resultSet.getInt("USER_ID")).thenReturn(123);
		when(resultSet.getInt("floor_id")).thenReturn(10);
		when(resultSet.getInt("seat_id")).thenReturn(20);
		when(resultSet.getInt("seat_number")).thenReturn(5);
		when(userDAO.findUserByuserId(123)).thenReturn(new User());
		Floor floor = new Floor();
		floor.setFloorId(10);
		Seat seat = new Seat();
		seat.setSeatId(20);
		seat.setSeatNumber(5);
		seat.setFloor(floor);
		BookingRowMapper bookingRowMapper = bookingDAOImpl.new BookingRowMapper();
		Booking booking = bookingRowMapper.mapRow(resultSet, 1);
		assertEquals(1, booking.getBookingId());
		assertEquals(LocalDate.of(2024, 2, 1), booking.getStartDate());
		assertEquals(LocalDate.of(2024, 2, 5), booking.getEndDate());
		assertEquals(BookingType.DAILY, booking.getBookingType());
		assertTrue(booking.isBookingStatus());
		assertNotNull(booking.getUser());
		assertEquals(10, booking.getSeat().getFloor().getFloorId());
		assertEquals(20, booking.getSeat().getSeatId());
		assertEquals(5, booking.getSeat().getSeatNumber());
	}

	@Test
	void testUserPreferredSeats() {
		List<Booking> mockBookings = new ArrayList<>();
		when(jdbcTemplate.query(anyString(), any(BookingRowMapper.class), anyInt(), anyInt())).thenReturn(mockBookings);
		List<Booking> result = bookingDAOImpl.userPreferredSeats(1, 123);
		verify(jdbcTemplate).query(anyString(), any(BookingRowMapper.class), eq(1), eq(123));
		assertNotNull(result);
	}

	@Test
	void testCreateBooking() throws DataBaseAccessException {
		BookingModel booking = new BookingModel();
		booking.setBookingType(BookingType.DAILY);
		User user = new User();
		Seat seat = new Seat();
		Shift shift = new Shift();
		when(jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class)).thenReturn(123);
		bookingDAOImpl.createBooking(booking, user, seat, shift);
		assertNotNull(booking);
	}

	@Test
	void testCreateBookingMapping() {
		BookingModel booking = new BookingModel();
		int bookingId = 123;
		bookingDAOImpl.createBookingMapping(booking, bookingId);
		verify(jdbcTemplate).update(
				"INSERT INTO BOOKING_MAPPING (BOOKING_DATE, BOOKING_ID, ADDITIONAL_DESKTOP, LUNCH, TEA_COFFEE, TEA_COFFEE_TYPE, PARKING, PARKING_TYPE) VALUES (?,?,?,?,?,?,?,?)",
				booking.getBookingDate(), bookingId, booking.getAdditionalDesktop(), booking.getLunch(),
				booking.getTeaCoffee(), booking.getTeaCoffeeType(), booking.getParkingOpted(),
				booking.getParkingType());
	}

	@Test
	void testGetAllBookingDetails() throws DataAccessException {
		List<BookingMapping> expectedList = new ArrayList<>();
		when(jdbcTemplate.query(anyString(), any(AttendanceRowMapper.class))).thenReturn(expectedList);
		List<BookingMapping> actualList = bookingDAOImpl.getAllBookingDetails();
		verify(jdbcTemplate).query(anyString(), any(AttendanceRowMapper.class));
		assertEquals(expectedList, actualList);
	}

	@Test
	void testApprovalAttendance() {
		int userId = 123;
		bookingDAOImpl.approvalAttendance(userId);
		verify(jdbcTemplate).update(
				"UPDATE booking_mapping AS bm " + "INNER JOIN booking AS b ON bm.booking_id = b.booking_id "
						+ "SET bm.marked_status = ?, " + "bm.booking_date = CURDATE() " + "WHERE b.user_id = ?",
				true, userId);
	}

	@Test
	void testHasAlreadyBookedForDate() throws DataBaseAccessException {
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), anyInt(), any(LocalDate.class),
				any(LocalDate.class), any(LocalDate.class), any(LocalDate.class))).thenReturn(1);
		assertTrue(bookingDAOImpl.hasAlreadyBookedForDate(123, LocalDate.of(2024, 2, 20), LocalDate.of(2024, 2, 25)));
		verify(jdbcTemplate).queryForObject(anyString(), eq(Integer.class), anyInt(), any(LocalDate.class),
				any(LocalDate.class), any(LocalDate.class), any(LocalDate.class));
	}

	@Test
	void testHasAlreadyBookedForDate_False() throws DataBaseAccessException {
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), anyInt(), any(LocalDate.class),
				any(LocalDate.class), any(LocalDate.class), any(LocalDate.class))).thenReturn(0);
		int userId = 1;
		LocalDate startDate = LocalDate.of(2024, 3, 1);
		LocalDate endDate = LocalDate.of(2024, 3, 5);
		boolean result = bookingDAOImpl.hasAlreadyBookedForDate(userId, startDate, endDate);
		assertFalse(result);
	}

	@Test
	void testGetAllBookedSeat() throws DataBaseAccessException {
		LocalDate startDate = LocalDate.of(2024, 2, 1);
		LocalDate endDate = LocalDate.of(2024, 2, 28);
		List<BookedSeatModel> expectedBookedSeats = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(BookedSeatRowMapper.class), any(Object.class), any(Object.class),
				any(Object.class), any(Object.class))).thenReturn(expectedBookedSeats);
		List<BookedSeatModel> actualBookedSeats = bookingDAOImpl.getAllBookedSeat(startDate, endDate);
		assertEquals(expectedBookedSeats, actualBookedSeats);
	}

	@Test
	void testGetReservedRestrainDetailsOfUsers() throws DataBaseAccessException {
		List<RestrainReserveOfUsersModel> expectedData = List
				.of(new RestrainReserveOfUsersModel());
		when(jdbcTemplate.query(anyString(), any(ReservedAndRestrainOfUserMapper.class))).thenReturn(expectedData);
		List<RestrainReserveOfUsersModel> result = null;
		result = bookingDAOImpl.getReservedRestrainDetailsOfUsers();
		verify(jdbcTemplate).query(eq(
				"SELECT U.user_id, S.seat_number,S.floor_id,R.reserved_id, R.reserved_status FROM user U JOIN reserved R ON R.user_id=U.user_id JOIN seat S ON s.seat_id = R.seat_id"),
				any(ReservedAndRestrainOfUserMapper.class));
		assertEquals(expectedData, result);
	}
}
