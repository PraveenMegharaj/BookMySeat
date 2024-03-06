package com.valtech.bookmyseat.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.valtech.bookmyseat.configuration.JwtTokenProvider;
import com.valtech.bookmyseat.dao.RoleDAO;
import com.valtech.bookmyseat.dao.UserDAO;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.BookingType;
import com.valtech.bookmyseat.entity.Otp;
import com.valtech.bookmyseat.entity.ParkingType;
import com.valtech.bookmyseat.entity.TeaAndCoffee;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.CustomDataAccessException;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.exception.DuplicateEmailException;
import com.valtech.bookmyseat.exception.DuplicateUserIdException;
import com.valtech.bookmyseat.exception.EmailException;
import com.valtech.bookmyseat.exception.UserNotFoundException;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.JwtAuthResponse;
import com.valtech.bookmyseat.model.LoginRequest;
import com.valtech.bookmyseat.model.UserModel;
import com.valtech.bookmyseat.model.UserModifyCancelSeat;
import com.valtech.bookmyseat.service.EmailService;
import com.valtech.bookmyseat.serviceimpl.UserServiceImpl;

import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

	@Mock
	private Random random;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private RoleDAO roleDAO;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private UserDAO userDAO;

	@Mock
	private AuthenticationManager authenticationManager;

	@Mock
	private JwtTokenProvider jwtTokenProvider;

	@Mock
	private UserDetails userDetails;

	@Mock
	private EmailService emailService;

	@Mock
	private TemporalUnit temporalUnit;

	@InjectMocks
	private UserServiceImpl userServiceImpl;

	@Test
	void testFindUserByEmail() {
		String testEmail = "vardhan@gmail.com";
		User mockUser = new User();
		mockUser.setEmailId(testEmail);
		mockUser.setFirstName("vardhan");
		when(userDAO.getUserByEmail(testEmail)).thenReturn(mockUser);
		User resultUser = userServiceImpl.findUserByEmail(testEmail);
		assertEquals(mockUser, resultUser);
	}

	@Test
	void testSuccessfulLogin() throws Exception {
		String expectedToken = "some_valid_token";
		when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
				.thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null));
		when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn(expectedToken);
		LoginRequest loginRequest = new LoginRequest("user@gmail.com", "password123");
		JwtAuthResponse response = userServiceImpl.login(loginRequest);
		assertEquals(expectedToken, response.getAccessToken());
		verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
	}

	@Test
	void createUserDetail_Success() throws Exception {
		User user = new User();
		when(userDAO.isEmailExists(user.getEmailId())).thenReturn(false);
		when(userDAO.isEmployeeIdExists(user.getUserId())).thenReturn(false);
		when(userDAO.userRegistration(user)).thenReturn(user);
		User createdUser = userServiceImpl.createUserDetail(user);
		verify(userDAO).isEmailExists(user.getEmailId());
		verify(userDAO).isEmployeeIdExists(user.getUserId());
		verify(emailService).sendApprovalEmailToAdmin(user);
		verify(userDAO).userRegistration(user);
		assertEquals(user, createdUser);
	}

	@Test
	void createUserDetail_DuplicateEmail() throws Exception {
		User user = new User();
		when(userDAO.isEmailExists(user.getEmailId())).thenReturn(true);
		assertThrows(DuplicateEmailException.class, () -> userServiceImpl.createUserDetail(user));
	}

	@Test
	void createUserDetail_DuplicateUserId() throws Exception {
		User user = new User();
		when(userDAO.isEmailExists(user.getEmailId())).thenReturn(false);
		when(userDAO.isEmployeeIdExists(user.getUserId())).thenReturn(true);
		assertThrows(DuplicateUserIdException.class, () -> userServiceImpl.createUserDetail(user));
	}

	@Test
	void testCreateUser_Success() throws Exception {
		UserModel userModel = new UserModel();
		userModel.setEmailId("test@example.com");
		userModel.setUserId(12345);
		userModel.setFirstName("John");
		userModel.setLastName("Doe");
		when(userDAO.isEmailExists(userModel.getEmailId())).thenReturn(false);
		when(userDAO.isEmployeeIdExists(userModel.getUserId())).thenReturn(false);
		when(userDAO.createUser(userModel)).thenReturn("user123");
		String result = userServiceImpl.createUser(userModel);
		assertEquals("user123", result);
		verify(emailService, times(1)).sendEmailToUser(userModel);
		verify(userDAO, times(1)).createUser(userModel);
	}

	@ParameterizedTest
	@MethodSource("userModelProvider")
	void testCreateUser(UserModel userModel, boolean emailExists, boolean userIdExists,
			Class<? extends Exception> expectedException) throws Exception {
		when(userDAO.isEmailExists(userModel.getEmailId())).thenReturn(emailExists);
		when(userDAO.isEmployeeIdExists(userModel.getUserId())).thenReturn(userIdExists);

		if (Objects.nonNull(expectedException)) {
			assertThrows(expectedException, () -> userServiceImpl.createUser(userModel));
		} else {
			userServiceImpl.createUser(userModel);
		}
	}

	static Stream<Object[]> userModelProvider() {
		UserModel userModel = new UserModel();
		userModel.setEmailId("test@example.com");
		userModel.setUserId(12345);
		userModel.setFirstName("John");
		userModel.setLastName("Doe");
		return Stream.of(new Object[] { userModel, true, true, DuplicateEmailException.class },
				new Object[] { userModel, true, false, DuplicateEmailException.class },
				new Object[] { userModel, false, true, DuplicateEmailException.class },
				new Object[] { userModel, false, false, null });
	}

	@Test
	void testCreateUser_FailedToSendEmail() throws Exception {
		UserModel userModel = new UserModel();
		userModel.setEmailId("test@example.com");
		userModel.setUserId(12345);
		userModel.setFirstName("John");
		userModel.setLastName("Doe");
		when(userDAO.isEmailExists(userModel.getEmailId())).thenReturn(false);
		when(userDAO.isEmployeeIdExists(userModel.getUserId())).thenReturn(false);
		doThrow(new RuntimeException("Failed to send email")).when(emailService).sendEmailToUser(userModel);
		assertThrows(EmailException.class, () -> userServiceImpl.createUser(userModel));
	}

	@Test
	void getUserById_Success() {
		int userId = 123;
		User expectedUser = new User();
		when(userDAO.getUserById(userId)).thenReturn(expectedUser);
		User actualUser = userServiceImpl.getUserById(userId);
		assertEquals(expectedUser, actualUser);
		verify(userDAO).getUserById(userId);
	}

	@Test
	void testGetUserSeatInfo_Success() {
		List<Map<String, Object>> mockUserSeatInfo = new ArrayList<>();
		Map<String, Object> userInfo1 = new HashMap<>();
		userInfo1.put("userId", "1");
		userInfo1.put("seatNumber", "A1");
		mockUserSeatInfo.add(userInfo1);
		when(userDAO.getUserSeatInfo()).thenReturn(mockUserSeatInfo);
		List<Map<String, Object>> result = userServiceImpl.getUserSeatInfo();
		assertEquals(mockUserSeatInfo, result);
	}

	@Test
	void testGetUserSeatInfo_Failure() {
		when(userDAO.getUserSeatInfo()).thenReturn(null);
		assertThrows(DataBaseAccessException.class, () -> userServiceImpl.getUserSeatInfo());
	}

	@Test
	void testGetAllUser_Success() {
		User user = new User();
		user.setUserId(1);
		user.setFirstName("John");
		user.setLastName("Doe");
		user.setEmailId("johndoe@example.com");
		User user1 = new User();
		user1.setUserId(1);
		user1.setFirstName("John");
		user1.setLastName("Doe");
		user1.setEmailId("johndoe@example.com");
		List<User> expectedUserList = new ArrayList<>();
		expectedUserList.add(user);
		expectedUserList.add(user1);
		when(userDAO.getAllUserDetails(anyInt())).thenReturn(expectedUserList);
		List<User> actualUserList = userServiceImpl.getAllUser(123);
		assertEquals(actualUserList, expectedUserList);
		verify(userDAO).getAllUserDetails(123);
		verifyNoMoreInteractions(userDAO);
	}

	@Test
	void testGetAllUser_NoUsersFound() {
		when(userDAO.getAllUserDetails(anyInt())).thenReturn(Collections.emptyList());
		List<User> actualUserList = userServiceImpl.getAllUser(456);
		assertNotNull(actualUserList);
		verify(userDAO).getAllUserDetails(456);
		verifyNoMoreInteractions(userDAO);
	}

	@Test
	void testgetUserDashboardDetails_NoUsersFound() {
		when(userDAO.getUserDashboardDetails(anyInt())).thenReturn(Collections.emptyList());
		List<BookingMapping> actualUserList = userServiceImpl.getUserDashboardDetails(456);
		assertNotNull(actualUserList);
		verify(userDAO).getUserDashboardDetails(456);
		verifyNoMoreInteractions(userDAO);
	}

	@Test
	void testGetBookingHistoryByUserId_Success() throws DataBaseAccessException {
		List<BookingDetailsOfUserForAdminAndUserReport> bookingHistoryList = new ArrayList<>();
		BookingDetailsOfUserForAdminAndUserReport booking1 = new BookingDetailsOfUserForAdminAndUserReport();
		booking1.setStartDate(LocalDate.now());
		booking1.setEndDate(LocalDate.now());
		booking1.setBookingType(BookingType.DAILY.toString());
		booking1.setParkingType(ParkingType.FOUR_WHEELER.toString());
		booking1.setTeaCoffeeType(TeaAndCoffee.COFFEE.toString());
		bookingHistoryList.add(booking1);
		when(userDAO.getBookingHistoryByUserId(anyInt())).thenReturn(bookingHistoryList);
		List<BookingDetailsOfUserForAdminAndUserReport> result = userServiceImpl.getBookingHistoryByUserId(anyInt());
		verify(userDAO).getBookingHistoryByUserId(anyInt());
		assertNotNull(result);
		assertEquals(bookingHistoryList.size(), result.size());
	}

	@Test
	void testGetBookingHistoryByUserId_Exception() throws DataBaseAccessException {
		when(userDAO.getBookingHistoryByUserId(5716)).thenReturn(null);
		assertThrows(DataBaseAccessException.class, () -> userServiceImpl.getBookingHistoryByUserId(5716));
		verify(userDAO).getBookingHistoryByUserId(anyInt());
	}

	@Test
	void testUpdateUserPassword_Success() {
		int userId = 1;
		String password = "newPassword";
		String encodedPassword = "encodedPassword";
		when(passwordEncoder.encode(password)).thenReturn(encodedPassword);
		doNothing().when(userDAO).updateUserPassword(userId, encodedPassword);
		String result = userServiceImpl.updateUserPassword(userId, password);
		assertEquals("Password changed successfully!", result);
		verify(passwordEncoder, times(1)).encode(password);
		verify(userDAO, times(1)).updateUserPassword(userId, encodedPassword);
	}

	@Test
	void testUpdateUserPassword_Failure() {
		int userId = 1;
		String password = "newPassword";
		when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
		doThrow(CustomDataAccessException.class).when(userDAO).updateUserPassword(userId, "encodedPassword");
		assertThrows(DataBaseAccessException.class, () -> userServiceImpl.updateUserPassword(userId, password));
		verify(passwordEncoder, times(1)).encode(password);
		verify(userDAO, times(1)).updateUserPassword(userId, "encodedPassword");
	}

	@Test
	void testCancelMySeat() {
		int bookingId = 123;
		int userId = 4511;
		userServiceImpl.cancelUserBooking(bookingId, userId);
		verify(userDAO).cancelUserSeat(bookingId);
	}

	@Test
	void testUpdateUserProfileByAdmin() {
		UserModel userModel = new UserModel();
		userServiceImpl.updateUserProfileByAdmin(userModel);
		verify(userDAO, times(1)).updateUser(userModel);
	}

	@Test
	void testUpdateUserSeat_Success() throws EmailException, DataBaseAccessException {
		int seatNumber = 10;
		int floorId = 2;
		int bookingId = 123;
		int seatId = 456;
		int userId = 789;
		when(userDAO.getSeatIdByNumberAndFloor(seatNumber, floorId)).thenReturn(seatId);
		when(userDAO.updateUserSeat(seatId, bookingId)).thenReturn(1);
		when(userDAO.getUserIdByBookingId(bookingId)).thenReturn(userId);
		List<UserModifyCancelSeat> modifyBookingList = new ArrayList<>();
		modifyBookingList.add(new UserModifyCancelSeat());
		when(userDAO.getBookingDeatilsOfUser(userId, seatId)).thenReturn(modifyBookingList);
		userServiceImpl.updateUserSeat(seatNumber, floorId, bookingId);
		verify(userDAO).getSeatIdByNumberAndFloor(seatNumber, floorId);
		verify(userDAO).updateUserSeat(seatId, bookingId);
		verify(userDAO).getUserIdByBookingId(bookingId);
		verify(userDAO).getBookingDeatilsOfUser(userId, seatId);
		verify(emailService).sendUpdateSeatEmailToUser(modifyBookingList.get(0));
	}

	@Test
	void testUpdateUserSeat_Exception() {
		int seatNumber = 10;
		int floorId = 2;
		int bookingId = 123;
		int seatId = 456;
		when(userDAO.getSeatIdByNumberAndFloor(seatNumber, floorId)).thenReturn(seatId);
		when(userDAO.updateUserSeat(seatId, bookingId)).thenReturn(-1);
		assertThrows(DataBaseAccessException.class,
				() -> userServiceImpl.updateUserSeat(seatNumber, floorId, bookingId));
		verify(userDAO).getSeatIdByNumberAndFloor(seatNumber, floorId);
		verify(userDAO).updateUserSeat(seatId, bookingId);
	}

	@Test
	void testCancelUserSeat_Exception() {
		int bookingId = 123;
		int seatId = 789;
		when(userDAO.getSeatIdByBookingId(bookingId)).thenReturn(seatId);
		when(userDAO.cancelUserSeat(bookingId)).thenReturn(-1);
		assertThrows(DataBaseAccessException.class, () -> userServiceImpl.cancelUserSeat(bookingId));
		verify(userDAO).getSeatIdByBookingId(bookingId);
		verify(userDAO).cancelUserSeat(bookingId);
	}

	@Test
	void testChangeUserPassword_Successful() {
		int userId = 123;
		String currentPassword = "oldPassword";
		String newPassword = "newPassword";
		String encodedNewPassword = "encodedNewPassword";
		User user = new User();
		user.setUserId(userId);
		user.setPassword("encodedOldPassword");
		when(userDAO.findUserByuserId(userId)).thenReturn(user);
		when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);
		when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);
		boolean result = userServiceImpl.changeUserPassword(userId, currentPassword, newPassword);
		assertTrue(result);
		verify(userDAO).findUserByuserId(userId);
		verify(passwordEncoder).matches(currentPassword, user.getPassword());
		verify(userDAO).updateUserPassword(userId, encodedNewPassword);
	}

	@Test
	void testChangeUserPassword_UserNotFound() {
		int userId = 123;
		String currentPassword = "oldPassword";
		String newPassword = "newPassword";
		when(userDAO.findUserByuserId(userId)).thenReturn(null);
		assertThrows(UserNotFoundException.class,
				() -> userServiceImpl.changeUserPassword(userId, currentPassword, newPassword));
		verify(userDAO).findUserByuserId(userId);
	}

	@Test
	void testChangeUserPassword_IncorrectPassword() {
		int userId = 123;
		String currentPassword = "oldPassword";
		String newPassword = "newPassword";
		User user = new User();
		user.setUserId(userId);
		user.setPassword("encodedOldPassword");
		when(userDAO.findUserByuserId(userId)).thenReturn(user);
		when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(false);
		boolean result = userServiceImpl.changeUserPassword(userId, currentPassword, newPassword);
		assertFalse(result);
		verify(userDAO).findUserByuserId(userId);
		verify(passwordEncoder).matches(currentPassword, user.getPassword());
	}

	@Test
	void testGenerateRandomOtp() {
		when(random.nextInt(10)).thenReturn(1);
		String generatedOtp = userServiceImpl.generateRandomOtp();
		assertEquals(4, generatedOtp.length());
		assertTrue(generatedOtp.matches("\\d+"));
	}

	@Test
	void testGenerateUserOtp_UserFound() {
		String emailId = "test@example.com";
		User user = new User();
		when(userDAO.getUserByEmail(emailId)).thenReturn(user);
		boolean result = userServiceImpl.generateUserOtp(emailId);
		assertTrue(result);
		verify(userDAO).saveOtp(any(Otp.class));
	}

	@Test
	void testGenerateUserOtp_UserNotFound() {
		String emailId = "test@example.com";
		when(userDAO.getUserByEmail(emailId)).thenReturn(null);
		assertThrows(NullPointerException.class, () -> userServiceImpl.generateUserOtp(emailId));
	}

	@Test
	void testHandleForgotPassword() throws MessagingException, IOException, TemplateException {
		String emailId = "example@example.com";
		User user = new User();
		user.setUserId(123);
		when(userDAO.getUserByEmail(emailId)).thenReturn(user);
		String otpValue = "123456";
		when(userDAO.getLatestOtpByUserId(user.getUserId())).thenReturn(otpValue);
		String result = userServiceImpl.handleForgotPassword(emailId);
		verify(userDAO, times(2)).getUserByEmail(emailId);
		verify(userDAO).getLatestOtpByUserId(user.getUserId());
		verify(emailService).sendOtpMailToUser(user, otpValue);
		assertEquals("OTP has successfully been sent, please check your provided email", result);
		when(userDAO.getLatestOtpByUserId(user.getUserId())).thenReturn(null);
		result = userServiceImpl.handleForgotPassword(emailId);
		verify(userDAO, times(4)).getUserByEmail(emailId);
		verify(userDAO, times(2)).getLatestOtpByUserId(user.getUserId());
		assertEquals("Please check your email", result);
		when(userDAO.getLatestOtpByUserId(user.getUserId())).thenReturn(otpValue);
		result = userServiceImpl.handleForgotPassword(emailId);
		verify(userDAO, times(6)).getUserByEmail(emailId);
		verify(userDAO, times(3)).getLatestOtpByUserId(user.getUserId());
		verify(emailService, times(2)).sendOtpMailToUser(user, otpValue);
		assertEquals("OTP has successfully been sent, please check your provided email", result);
		when(userDAO.getUserByEmail(emailId)).thenReturn(null);
		result = userServiceImpl.handleForgotPassword(emailId);
		verify(userDAO, times(7)).getUserByEmail(emailId);
		assertEquals("User doesn't exist", result);
	}

	@Test
	void testVerifyOtp_ValidOtp() {
		int userId = 123;
		String enteredOtp = "123456";
		String latestOtp = "123456";
		LocalDateTime otpCreationTime = LocalDateTime.now().minusMinutes(1);
		when(userDAO.getLatestOtpByUserId(userId)).thenReturn(latestOtp);
		when(userDAO.getLatestOtpCreationTimeByUserId(userId)).thenReturn(otpCreationTime);
		boolean result = userServiceImpl.verifyOtp(userId, enteredOtp);
		assertTrue(result);
		verify(userDAO).getLatestOtpByUserId(userId);
		verify(userDAO).getLatestOtpCreationTimeByUserId(userId);
	}

	@Test
	void testVerifyOtp_InvalidOtp() {
		int userId = 123;
		String enteredOtp = "123456";
		String latestOtp = "654321";
		when(userDAO.getLatestOtpByUserId(userId)).thenReturn(latestOtp);
		boolean result = userServiceImpl.verifyOtp(userId, enteredOtp);
		assertFalse(result);
		verify(userDAO).getLatestOtpByUserId(userId);
	}

	@Test
	void testUpdateUserForgotPassword_Success() {
		int userId = 123;
		String newPassword = "newPassword";
		int rowsAffected = 1;
		when(userDAO.getRowsAffected()).thenReturn(rowsAffected);
		boolean result = userServiceImpl.updateUserForgotPassword(userId, newPassword);
		assertTrue(result);
		verify(userDAO).updateUseForgetPassword(userId, newPassword);
		verify(userDAO).getRowsAffected();
	}

	@Test
	void testUpdateUserForgotPassword_Failure() {
		int userId = 123;
		String newPassword = "newPassword";
		int rowsAffected = 0;
		when(userDAO.getRowsAffected()).thenReturn(rowsAffected);
		boolean result = userServiceImpl.updateUserForgotPassword(userId, newPassword);
		assertFalse(result);
		verify(userDAO).updateUseForgetPassword(userId, newPassword);
		verify(userDAO).getRowsAffected();
	}

	@Test
	void testcancelUserBookingThrowsDataBaseAccessException() throws DataBaseAccessException {
		int bookingId = 123;
		when(userDAO.cancelUserSeat(bookingId)).thenReturn(-1);
		assertThrows(DataBaseAccessException.class, () -> userServiceImpl.cancelUserBooking(bookingId, 456));
	}
}