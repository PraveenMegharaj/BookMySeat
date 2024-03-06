package com.valtech.bookmyseat.daoimpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.dao.SeatDAO;
import com.valtech.bookmyseat.entity.Reserved;
import com.valtech.bookmyseat.entity.Restrain;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.mapper.AdminDashBoardMapper;
import com.valtech.bookmyseat.mapper.BookingDetailsOfUserForAdminAndUserReportMapper;
import com.valtech.bookmyseat.mapper.ReservedMapper;
import com.valtech.bookmyseat.mapper.RestrainMapper;
import com.valtech.bookmyseat.mapper.RestrainRequestMapper;
import com.valtech.bookmyseat.mapper.UserApprovedMapper;
import com.valtech.bookmyseat.mapper.UserRequestsMapper;
import com.valtech.bookmyseat.model.AdminDashBoardModel;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.UserRequestsModel;

@ExtendWith(MockitoExtension.class)
class AdminDaoImplTest {

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private ResultSet resultSet;

	@Mock
	private SeatDAO seatDAO;

	@InjectMocks
	private AdminDaoImpl adminDaoImpl;

	@Test
	void testFetchDailyBookingDetails() throws DataBaseAccessException {
		List<AdminDashBoardModel> expectedList = new ArrayList<>();
		AdminDashBoardModel booking1 = new AdminDashBoardModel();
		booking1.setDate(LocalDate.now());
		booking1.setSeatsBooked(10);
		booking1.setTotalLunchBooked(5);
		booking1.setTotalTeaBooked(3);
		booking1.setTotalCoffeeBooked(2);
		booking1.setTotalParkingBooked(8);
		booking1.setTotalTwoWheelerParkingBooked(6);
		booking1.setTotalFourWheelerParkingBooked(2);
		booking1.setTotalDesktopBooked(7);
		expectedList.add(booking1);
		String expectedSql = "SELECT COUNT(DISTINCT b.seat_id) AS seats_booked, "
				+ "SUM(bm.lunch) AS total_lunch_booked, "
				+ "SUM(CASE WHEN bm.tea_coffee_type = 'TEA' THEN 1 ELSE 0 END) AS total_tea_booked, "
				+ "SUM(CASE WHEN bm.tea_coffee_type = 'COFFEE' THEN 1 ELSE 0 END) AS total_coffee_booked, "
				+ "SUM(bm.parking) AS total_parking_booked, "
				+ "SUM(CASE WHEN bm.parking_type = 'TWO_WHEELER' THEN 1 ELSE 0 END) AS total_two_wheeler_parking_booked, "
				+ "SUM(CASE WHEN bm.parking_type = 'FOUR_WHEELER' THEN 1 ELSE 0 END) AS total_four_wheeler_parking_booked, "
				+ "SUM(CASE WHEN bm.additional_desktop = 1 THEN 1 ELSE 0 END) AS total_desktop_booked "
				+ "FROM booking b " + "JOIN booking_mapping bm ON b.booking_id = bm.booking_id "
				+ "WHERE b.start_date <= CURDATE() AND b.end_date >= CURDATE()";

		when(jdbcTemplate.query(eq(expectedSql), any(AdminDashBoardMapper.class))).thenReturn(expectedList);
		List<AdminDashBoardModel> result = adminDaoImpl.fetchAdminDashboardDetails();
		assertEquals(expectedList, result);
	}

	@Test
	void testFetchUserRequests() throws DataBaseAccessException {
		List<UserRequestsModel> expectedList = new ArrayList<>();
		UserRequestsModel user1 = new UserRequestsModel();
		user1.setName("John Doe");
		user1.setUserID(1);
		user1.setEmailID("john.doe@example.com");
		user1.setRegsiterdDate(LocalDate.now());
		user1.setApprovalStatus("PENDING");
		expectedList.add(user1);
		String expectedSql = "SELECT CONCAT(first_name, ' ', last_name) AS name,user_id,email_id,registered_date,approval_status"
				+ " FROM user WHERE approval_status IN ('PENDING', 'APPROVED', 'REJECTED') AND role_id=2";
		when(jdbcTemplate.query(eq(expectedSql), any(UserRequestsMapper.class))).thenReturn(expectedList);
		List<UserRequestsModel> result = adminDaoImpl.fetchUserRequests();
		assertEquals(expectedList, result);
	}

	@Test
	void testUpdateUserRequests() throws DataBaseAccessException {
		User user = new User();
		String expectedSql = "UPDATE user SET approval_status = ?,modified_by=?,modified_date=? WHERE user_id = ?";
		int expectedResult = 1;
		when(jdbcTemplate.update(eq(expectedSql), anyString(), anyInt(), any(LocalDate.class), anyInt()))
				.thenReturn(expectedResult);
		int result = adminDaoImpl.updateUserRequests(user, 456);
		assertEquals(expectedResult, result);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetAllBookingDetailsOfUserForAdminReport() throws SQLException {
		RowMapper<BookingDetailsOfUserForAdminAndUserReport> rowMapper = new BookingDetailsOfUserForAdminAndUserReportMapper();
		when(jdbcTemplate.query(anyString(), any(RowMapper.class))).thenReturn(new ArrayList<>());
		adminDaoImpl.getAllBookingDetailsOfUserForAdminReport();
		assertNotNull(rowMapper);
	}

	@Test
	void testReserveSeat() throws DataBaseAccessException, SQLException {
		when(jdbcTemplate.query(anyString(), any(ReservedMapper.class))).thenReturn(List.of(new Reserved()));
		List<Reserved> reservedSeats = null;
		reservedSeats = adminDaoImpl.reserveSeat();
		verify(jdbcTemplate).query(eq(
				"SELECT user.user_id, user.first_name, reserved.reserved_status, reserved.reserved_id, seat.seat_id, seat.seat_number, seat.floor_id FROM user JOIN reserved ON user.user_id = reserved.user_id JOIN seat ON reserved.seat_id = seat.seat_id WHERE reserved.reserved_status = true"),
				any(ReservedMapper.class));
		assertNotNull(reservedSeats);
		assertEquals(1, reservedSeats.size());
		Reserved reserved = reservedSeats.get(0);
		assertNotNull(reserved);
	}

	@Test
	void testReserveSeatInDB() throws DataBaseAccessException {
		when(seatDAO.findSeatId(anyInt(), anyInt())).thenReturn(123);
		when(jdbcTemplate.update(anyString(), anyInt(), anyInt(), anyBoolean())).thenReturn(1);
		int result = adminDaoImpl.reserveSeatInDB(456, 789, 10);
		verify(jdbcTemplate).update("INSERT INTO reserved (user_id, seat_id, reserved_status) VALUES (?, ?,?)", 456,
				123, true);
		assertEquals(1, result);
	}

	@Test
	void testRestrain() throws DataBaseAccessException {
		int floorId = 5;
		Restrain expectedRestrain = new Restrain();
		when(jdbcTemplate.queryForObject(anyString(), any(RestrainRequestMapper.class), anyInt()))
				.thenReturn(expectedRestrain);
		Restrain actualRestrain = adminDaoImpl.restrain(floorId);
		verify(jdbcTemplate).queryForObject(anyString(), any(RestrainRequestMapper.class), eq(floorId));
		assertEquals(expectedRestrain, actualRestrain);
	}

	@Test
	void testGetRestrainId_WhenIdExists() throws DataBaseAccessException {
		int floorId = 5;
		int expectedRestrainId = 10;
		String sql = "SELECT restrain_id FROM restrain WHERE floor_id = ?";
		when(jdbcTemplate.queryForObject(sql, Integer.class, floorId)).thenReturn(expectedRestrainId);
		int actualRestrainId = adminDaoImpl.getRestrainId(floorId);
		assertEquals(expectedRestrainId, actualRestrainId);
	}

	@Test
	void testGetRestrainId_WhenIdDoesNotExist() throws DataBaseAccessException {
		int floorId = 5;
		String sql = "SELECT restrain_id FROM restrain WHERE floor_id = ?";
		when(jdbcTemplate.queryForObject(sql, Integer.class, floorId)).thenReturn(null);
		int actualRestrainId = adminDaoImpl.getRestrainId(floorId);
		assertEquals(-1, actualRestrainId);
	}

	@Test
	void testGetRestrainId_WhenDataBaseAccessExceptionOccurs() {
		int floorId = 5;
		String sql = "SELECT restrain_id FROM restrain WHERE floor_id = ?";
		when(jdbcTemplate.queryForObject(sql, Integer.class, floorId))
				.thenThrow(new DataBaseAccessException("Mocked Exception"));
		assertThrows(DataBaseAccessException.class, () -> adminDaoImpl.getRestrainId(floorId));
	}

	@Test
	void testRestrainUsers() throws DataBaseAccessException {
		Restrain restrain = new Restrain();
		Restrain restrain1 = new Restrain();
		List<Restrain> expectedRestraints = Arrays.asList(restrain, restrain1);
		List<Restrain> result = adminDaoImpl.restrainedUsers();
		verify(jdbcTemplate).query(anyString(), any(RestrainMapper.class));
		assertNotNull(expectedRestraints);
		assertNotNull(result);
	}

	@Test
	void testFindApprovedUsers() throws DataBaseAccessException {
		User user = new User();
		User user1 = new User();
		List<User> mockUsers = new ArrayList<>();
		mockUsers.add(user);
		mockUsers.add(user1);
		when(jdbcTemplate.query(anyString(), any(UserApprovedMapper.class))).thenReturn(mockUsers);
		List<User> approvedUsers = adminDaoImpl.findApprovedUsers();
		assertNotNull(approvedUsers);
	}
}