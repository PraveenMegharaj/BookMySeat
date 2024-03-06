package com.valtech.bookmyseat.daoimpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.valtech.bookmyseat.dao.ProjectDAO;
import com.valtech.bookmyseat.dao.RoleDAO;
import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Otp;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.Role;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.mapper.BookingDetailsOfUserForAdminAndUserReportMapper;
import com.valtech.bookmyseat.mapper.UserPrefernceMapper;
import com.valtech.bookmyseat.mapper.UserRowMapper;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.UserModel;
import com.valtech.bookmyseat.model.UserModifyCancelSeat;

@ExtendWith(MockitoExtension.class)
class UserDAOImplTest {

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private RoleDAO roleDAO;

	@Mock
	private ProjectDAO projectDAO;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UserDaoImpl userDAOImpl;

	@Test
	void testGetUserByEmail() throws SQLException {
		String emailId = "test@example.com";
		User expectedUser = new User();
		when(jdbcTemplate.queryForObject(anyString(), any(UserRowMapper.class), any(Object[].class)))
				.thenReturn(expectedUser);
		User actualUser = userDAOImpl.getUserByEmail(emailId);
		verify(jdbcTemplate).queryForObject(anyString(), any(UserRowMapper.class), any(Object[].class));
		assertEquals(expectedUser, actualUser);
	}

	@Test
	void testFindUserByuserId() {
		int userId = 1;
		User expectedUser = new User();
		expectedUser.setUserId(userId);
		when(jdbcTemplate.queryForObject(anyString(), any(UserRowMapper.class), any(Object[].class)))
				.thenReturn(expectedUser);
		User actualUser = userDAOImpl.findUserByuserId(userId);
		verify(jdbcTemplate).queryForObject(anyString(), any(UserRowMapper.class), any(Object[].class));
		assertEquals(expectedUser, actualUser);
	}

	@Test
	void testIsEmailExists_EmailExists() {
		String emailId = "test@example.com";
		int count = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(emailId))).thenReturn(count);
		boolean result = userDAOImpl.isEmailExists(emailId);
		assertTrue(result);
	}

	@Test
	void testIsEmailExists_EmailDoesNotExist() {
		String emailId = "nonexistent@example.com";
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(emailId)))
				.thenThrow(EmptyResultDataAccessException.class);
		boolean result = userDAOImpl.isEmailExists(emailId);
		assertFalse(result);
	}

	@Test
	void testIsEmployeeIdExists_Exists() {
		int userId = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(userId))).thenReturn(1);
		boolean result = userDAOImpl.isEmployeeIdExists(userId);
		assertTrue(result);
	}

	@Test
	void testIsEmployeeIdExists_NotExists() {
		int userId = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(userId))).thenReturn(0);
		boolean result = userDAOImpl.isEmployeeIdExists(userId);
		assertFalse(result);
	}

	@Test
	void testIsEmployeeIdExists_Exception() {
		int userId = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(userId)))
				.thenThrow(EmptyResultDataAccessException.class);
		boolean result = userDAOImpl.isEmployeeIdExists(userId);
		assertFalse(result);
	}

	@Test
	void testUpdateUser() {
		Project project = new Project();
		project.setProjectId(1001);
		UserModel userModel = new UserModel();
		userModel.setUserId(1);
		userModel.setPhoneNumber(1234567890);
		userModel.setProject(project);
		userDAOImpl.updateUser(userModel);
		assertNotNull(userModel);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetUserById_Success() throws SQLException {
		int userId = 123;
		long phoneNumber = 1234567890L;
		ResultSet resultSet = mock(ResultSet.class);
		when(resultSet.getInt("user_id")).thenReturn(userId);
		when(resultSet.getLong("phone_number")).thenReturn(phoneNumber);
		when(jdbcTemplate.queryForObject(anyString(), any(RowMapper.class), anyInt())).thenAnswer(invocation -> {
			RowMapper<User> rowMapper = invocation.getArgument(1);
			return rowMapper.mapRow(resultSet, 0);
		});
		User actualUser = userDAOImpl.getUserById(userId);
		verify(jdbcTemplate).queryForObject(anyString(), any(RowMapper.class), eq(userId));
		assertNotNull(actualUser);
		assertEquals(userId, actualUser.getUserId());
		assertEquals(phoneNumber, actualUser.getPhoneNumber());
	}

	@Test
	void testGetUserSeatInfo() throws DataBaseAccessException {
		when(jdbcTemplate.queryForList(anyString())).thenReturn(getMockedUserSeatInfo());
		List<Map<String, Object>> result = userDAOImpl.getUserSeatInfo();
		verify(jdbcTemplate).queryForList(
				"SELECT booking.booking_id, booking.booking_status, user.first_name, user.user_id, seat.seat_number, seat.floor_id, booking.start_date, booking.end_date "
						+ "FROM booking " + "JOIN user ON booking.user_id = user.user_id "
						+ "JOIN seat ON booking.seat_id = seat.seat_id");
		assertNotNull(result);
		assertEquals(1, result.size());
	}

	private List<Map<String, Object>> getMockedUserSeatInfo() {
		List<Map<String, Object>> data = new ArrayList<>();
		Map<String, Object> rowData = new HashMap<>();
		rowData.put("user_id", 1);
		rowData.put("user_name", "John Doe");
		rowData.put("booking_status", "True");
		rowData.put("seat_number", 15);
		rowData.put("booking_id", 2);
		data.add(rowData);
		return data;
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetAllUserDetails() throws SQLException {
		ResultSet resultSet = mock(ResultSet.class);
		when(jdbcTemplate.query(anyString(), any(RowMapper.class), any(Object.class)))
				.thenReturn(Arrays.asList(resultSet));
		List<User> userDetailsList = userDAOImpl.getAllUserDetails(1);
		assertEquals(1, userDetailsList.size());
	}

	@Test
	void testGetBookingHistoryByUserId_Success() throws DataBaseAccessException {
		List<BookingDetailsOfUserForAdminAndUserReport> expectedBookingHistoryList = new ArrayList<>();
		BookingDetailsOfUserForAdminAndUserReport booking1 = new BookingDetailsOfUserForAdminAndUserReport();
		booking1.setUserName("John Doe");
		booking1.setUserId(123);
		booking1.setBookingType("DAILY");
		booking1.setSeatNumber(20);
		booking1.setFloorName("Floor 1");
		booking1.setStartTime(LocalTime.now());
		booking1.setEndTime(LocalTime.now());
		booking1.setStartDate(LocalDate.now());
		booking1.setEndDate(LocalDate.now());
		booking1.setTeaCoffeeType("COFFEE");
		booking1.setParkingType("FOUR_WHEELER");
		booking1.setLunch(true);
		expectedBookingHistoryList.add(booking1);
		String expectedSql = "SELECT CONCAT(U.first_name, ' ', U.last_name) AS user_name,U.user_id,B.booking_type,B.booking_id, "
				+ "S.seat_number,F.floor_name,SH.start_time,SH.end_time,B.start_date,B.booking_status, "
				+ "B.end_date,MAX(BM.tea_coffee_type) AS tea_coffee_type, "
				+ "MAX(BM.parking_type) AS parking_type,MAX(BM.lunch) AS lunch FROM user U "
				+ "JOIN booking B ON U.user_id = B.user_id "
				+ "JOIN booking_mapping BM ON B.booking_id = BM.booking_id JOIN seat S ON B.seat_id = S.seat_id "
				+ "JOIN floor F ON S.floor_id = F.floor_id JOIN shift SH ON B.shift_id = SH.shift_id "
				+ "WHERE U.user_id = ?  GROUP BY U.user_id, S.seat_number, F.floor_name, "
				+ "SH.start_time, SH.end_time, B.start_date, B.end_date,B.booking_type,B.booking_id,B.booking_status;";
		when(jdbcTemplate.query(eq(expectedSql), any(BookingDetailsOfUserForAdminAndUserReportMapper.class),
				eq(booking1.getUserId()))).thenReturn(expectedBookingHistoryList);
		List<BookingDetailsOfUserForAdminAndUserReport> result = userDAOImpl
				.getBookingHistoryByUserId(booking1.getUserId());
		verify(jdbcTemplate).query(eq(expectedSql), any(BookingDetailsOfUserForAdminAndUserReportMapper.class),
				eq(booking1.getUserId()));
		assertEquals(expectedBookingHistoryList, result);
	}

	@Test
	void testGetUserDashboardDetails() throws DataAccessException {
		User user = new User();
		user.setUserId(123);
		Booking booking = new Booking();
		booking.setUser(user);
		List<Booking> expectedBookingList = new ArrayList<>();
		expectedBookingList.add(booking);
		List<BookingMapping> actualBookingList = userDAOImpl.getUserDashboardDetails(123);
		assertNotNull(actualBookingList);
	}

	@Test
	void testUpdateUserPassword() throws DataAccessException {
		int userId = 123;
		String newPassword = "newPassword";
		int expectedAffectedRows = 1;
		when(jdbcTemplate.update(anyString(), anyString(), anyInt())).thenReturn(expectedAffectedRows);
		userDAOImpl.updateUserPassword(userId, newPassword);
		verify(jdbcTemplate, times(1)).update("UPDATE USER SET PASSWORD=? WHERE user_id=?", newPassword, userId);
	}

	@Test
	void testUserRegistration() {
		Role role = new Role();
		role.setRoleId(2);
		role.setRoleName("USER");
		Project project = new Project();
		project.setProjectId(6);
		project.setProjectName("BOOKMYSEAT");
		when(roleDAO.getUserRoleByRoleID(2)).thenReturn(role);
		when(projectDAO.getProjectById(6)).thenReturn(project);
		User user = new User();
		user.setUserId(1);
		user.setEmailId("test@example.com");
		user.setFirstName("John");
		user.setLastName("Doe");
		user.setPassword("password");
		user.setPhoneNumber(1234567890L);
		userDAOImpl.userRegistration(user);
		ArgumentCaptor<Object[]> argsCaptor = ArgumentCaptor.forClass(Object[].class);
		verify(jdbcTemplate).update(eq(
				"INSERT INTO USER (USER_ID, EMAIL_ID, FIRST_NAME, LAST_NAME, PASSWORD, APPROVAL_STATUS, PHONE_NUMBER, REGISTERED_DATE, MODIFIED_DATE, CREATED_BY, MODIFIED_BY, ROLE_ID,PROJECT_ID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"),
				argsCaptor.capture());
		Object[] capturedArgs = argsCaptor.getValue();
		assertEquals(13, capturedArgs.length);
		assertEquals(1, capturedArgs[0]);
		assertEquals("test@example.com", capturedArgs[1]);
		assertEquals("John", capturedArgs[2]);
		assertEquals("Doe", capturedArgs[3]);
		assertEquals("PENDING", capturedArgs[5]);
		assertEquals(1234567890L, capturedArgs[6]);
		assertNotNull(capturedArgs[7]);
		assertNotNull(capturedArgs[8]);
		assertEquals(1, capturedArgs[9]);
		assertEquals(1, capturedArgs[10]);
		assertEquals(2, capturedArgs[11]);
		assertEquals(6, capturedArgs[12]);
	}

	@Test
	void testGetById() {
		User expectedUser = new User();
		expectedUser.setUserId(1);
		when(jdbcTemplate.queryForObject(anyString(), any(UserPrefernceMapper.class), anyInt()))
				.thenReturn(expectedUser);
		User actualUser = userDAOImpl.getById(1);
		verify(jdbcTemplate).queryForObject(anyString(), any(UserPrefernceMapper.class), eq(1));
		assertEquals(expectedUser, actualUser);
	}

	@Test
	void testCreateUser() {
		UserModel userModel = new UserModel();
		userModel.setUserId(1);
		userModel.setEmailId("test@example.com");
		userModel.setFirstName("John");
		userModel.setLastName("Doe");
		userModel.setPhoneNumber(1234567890L);
		userModel.setProjectId(1);
		Role role = new Role();
		role.setRoleId(2);
		when(roleDAO.getUserRoleByRoleID(2)).thenReturn(role);
		String encodedPassword = "encodedPassword";
		when(passwordEncoder.encode(anyString())).thenReturn(encodedPassword);
		String result = userDAOImpl.createUser(userModel);
		assertEquals("User created successfully", result);
		verify(roleDAO, times(1)).getUserRoleByRoleID(2);
		verify(passwordEncoder, times(1)).encode(anyString());
		verify(jdbcTemplate, times(1)).update(anyString(), anyInt(), anyString(), anyString(), anyString(), anyString(),
				anyString(), anyLong(), any(LocalDateTime.class), any(LocalDateTime.class), anyInt(), anyInt(),
				anyInt(), anyInt());
	}

	@Test
	void testGetSeatIdByNumberAndFloor_Exists() {
		int expectedSeatId = 123;
		int seatNumber = 5;
		int floorId = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(seatNumber), eq(floorId)))
				.thenReturn(expectedSeatId);
		Integer actualSeatId = userDAOImpl.getSeatIdByNumberAndFloor(seatNumber, floorId);
		assertEquals(expectedSeatId, actualSeatId);
	}

	@Test
	void testGetSeatIdByNumberAndFloor_NotExists() {
		int seatNumber = 5;
		int floorId = 1;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(seatNumber), eq(floorId)))
				.thenThrow(EmptyResultDataAccessException.class);
		Integer actualSeatId = userDAOImpl.getSeatIdByNumberAndFloor(seatNumber, floorId);
		assertNull(actualSeatId);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetUserIdByBookingId_WhenBookingExists() {
		when(jdbcTemplate.queryForObject(any(String.class), any(Class.class), any(Integer.class))).thenReturn(123);
		Integer userId = userDAOImpl.getUserIdByBookingId(456);
		verify(jdbcTemplate).queryForObject(any(String.class), any(Class.class), eq(456));
		assertEquals(Integer.valueOf(123), userId);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetUserIdByBookingId_WhenBookingDoesNotExist() {
		when(jdbcTemplate.queryForObject(any(String.class), any(Class.class), any(Integer.class)))
				.thenThrow(new EmptyResultDataAccessException(1));
		Integer userId = userDAOImpl.getUserIdByBookingId(456);
		verify(jdbcTemplate).queryForObject(any(String.class), any(Class.class), eq(456));
		assertEquals(null, userId);
	}

	@Test
	void testUpdateUserSeat() throws DataBaseAccessException {
		int expectedUpdatedRows = 1;
		when(jdbcTemplate.update(anyString(), anyInt(), anyInt())).thenReturn(expectedUpdatedRows);
		int actualUpdatedRows = userDAOImpl.updateUserSeat(123, 456);
		verify(jdbcTemplate).update("UPDATE BOOKING SET SEAT_ID = ? WHERE BOOKING_ID = ?", 123, 456);
		assertEquals(expectedUpdatedRows, actualUpdatedRows);
	}

	@Test
	void testCancelUserSeat() {
		int bookingId = 123;
		int expectedResult = 1;
		when(jdbcTemplate.update(anyString(), anyInt())).thenReturn(expectedResult);
		int actualResult = 0;
		actualResult = userDAOImpl.cancelUserSeat(bookingId);
		verify(jdbcTemplate).update("UPDATE BOOKING SET BOOKING_STATUS = FALSE WHERE BOOKING_ID = ?", bookingId);
		assertEquals(expectedResult, actualResult);
	}

	@SuppressWarnings("unchecked")
	@Test
	void testGetBookingDetailsOfUser() {
		List<UserModifyCancelSeat> expectedResults = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(RowMapper.class), any(Integer.class), any(Integer.class)))
				.thenReturn(expectedResults);
		List<UserModifyCancelSeat> actualResults = userDAOImpl.getBookingDeatilsOfUser(1, 2);
		assertEquals(expectedResults, actualResults);
		verify(jdbcTemplate).query(any(String.class), any(RowMapper.class), eq(1), eq(2));
	}

	@Test
	void testGetLatestOtpCreationTimeByUserId() {
		int userId = 123;
		LocalDateTime expectedOtpCreationTime = LocalDateTime.now();
		when(jdbcTemplate.queryForObject(anyString(), eq(LocalDateTime.class), eq(userId)))
				.thenReturn(expectedOtpCreationTime);
		LocalDateTime actualOtpCreationTime = userDAOImpl.getLatestOtpCreationTimeByUserId(userId);
		assertEquals(expectedOtpCreationTime, actualOtpCreationTime);
		verify(jdbcTemplate).queryForObject(anyString(), eq(LocalDateTime.class), eq(userId));
	}

	@Test
	void testGetLatestOtpByUserId() {
		int userId = 123;
		String expectedOtp = "123456";
		when(jdbcTemplate.queryForObject(anyString(), eq(String.class), eq(userId))).thenReturn(expectedOtp);
		String actualOtp = userDAOImpl.getLatestOtpByUserId(userId);
		verify(jdbcTemplate).queryForObject(anyString(), eq(String.class), eq(userId));
		assertEquals(expectedOtp, actualOtp);
	}

	@Test
	void testSaveOtp() {
		Otp otp = mock(Otp.class);
		User user = mock(User.class);
		when(otp.getUser()).thenReturn(user);
		when(user.getUserId()).thenReturn(123);
		when(otp.getOtpValue()).thenReturn("123456");
		userDAOImpl.saveOtp(otp);
		ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<Object[]> paramsCaptor = ArgumentCaptor.forClass(Object[].class);
		verify(jdbcTemplate).update(sqlCaptor.capture(), paramsCaptor.capture());
		String expectedSql = "INSERT INTO otp (user_id, otp_value) VALUES (?, ?)";
		assertEquals(expectedSql, sqlCaptor.getValue());
		Object[] params = paramsCaptor.getValue();
		assertEquals(2, params.length);
		assertEquals(123, params[0]);
		assertEquals("123456", params[1]);
	}

	@Test
	void testGetRowsAffected() {
		int actualRowsAffected = userDAOImpl.getRowsAffected();
		assertEquals(0, actualRowsAffected);
	}

	@Test
	void testUpdateUseForgetPassword() {
		int userId = 123;
		String newPassword = "newPassword";
		String encodedPassword = "encodedPassword";
		when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);
		userDAOImpl.updateUseForgetPassword(userId, newPassword);
		verify(passwordEncoder).encode(newPassword);
		verify(jdbcTemplate).update("UPDATE user SET password = ? WHERE user_id = ?", encodedPassword, userId);
	}

	@Test
	void testGetSeatIdByBookingId() throws DataBaseAccessException {
		int bookingId = 123;
		int expectedSeatId = 456;
		when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(bookingId))).thenReturn(expectedSeatId);
		Integer actualSeatId = null;
		actualSeatId = userDAOImpl.getSeatIdByBookingId(bookingId);
		assertNotNull(actualSeatId);
		assertEquals(expectedSeatId, actualSeatId.intValue());
		verify(jdbcTemplate).queryForObject(anyString(), eq(Integer.class), eq(bookingId));
	}

	@Test
	void testSetRestrainId() {
		int restrainId = 123;
		int userId = 456;
		userDAOImpl.setrestrainId(restrainId, userId);
		verify(jdbcTemplate).update("UPDATE USER SET RESTRAIN_ID=? WHERE USER_ID=?", restrainId, userId);
	}
}