package com.valtech.bookmyseat.daoimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.ProjectDAO;
import com.valtech.bookmyseat.dao.RoleDAO;
import com.valtech.bookmyseat.dao.UserDAO;
import com.valtech.bookmyseat.entity.ApprovalStatus;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Otp;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.Role;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.mapper.BookingDetailsOfUserForAdminAndUserReportMapper;
import com.valtech.bookmyseat.mapper.ModifyUserMapper;
import com.valtech.bookmyseat.mapper.UpdateSeatBookingMapper;
import com.valtech.bookmyseat.mapper.UserDashboardMapper;
import com.valtech.bookmyseat.mapper.UserPrefernceMapper;
import com.valtech.bookmyseat.mapper.UserRowMapper;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.UserModel;
import com.valtech.bookmyseat.model.UserModifyCancelSeat;

@Repository
public class UserDaoImpl implements UserDAO {
	private static final String INNER_JOIN = "INNER JOIN ";
	private static final String SELECT = "SELECT ";

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleDAO roleDAO;

	@Autowired
	private ProjectDAO projectDAO;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private int rowsAffected;

	@Override
	public User getUserByEmail(String emailId) {
		String selectQuery = "SELECT U.USER_ID, U.EMAIL_ID, U.FIRST_NAME, U.LAST_NAME, U.PASSWORD, U.APPROVAL_STATUS, "
				+ "U.PHONE_NUMBER, U.REGISTERED_DATE, U.MODIFIED_DATE, U.PROJECT_ID, P.PROJECT_NAME, "
				+ "R.ROLE_ID, R.ROLE_NAME, U.CREATED_BY, U.MODIFIED_BY, R1.RESTRAIN_ID " + "FROM USER U "
				+ "JOIN `ROLE` R ON U.ROLE_ID = R.ROLE_ID " + "JOIN PROJECT P ON U.PROJECT_ID = P.PROJECT_ID "
				+ "LEFT JOIN RESTRAIN R1 ON U.RESTRAIN_ID = R1.RESTRAIN_ID " + "WHERE U.EMAIL_ID = ?";

		return jdbcTemplate.queryForObject(selectQuery, new UserRowMapper(), emailId);
	}

	@Override
	public User userRegistration(User user) {
		String createQuery = "INSERT INTO USER (USER_ID, EMAIL_ID, FIRST_NAME, LAST_NAME, PASSWORD, APPROVAL_STATUS, PHONE_NUMBER, REGISTERED_DATE, MODIFIED_DATE, CREATED_BY, MODIFIED_BY, ROLE_ID,PROJECT_ID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
		Role role = roleDAO.getUserRoleByRoleID(2);
		Project project = projectDAO.getProjectById(6);
		jdbcTemplate.update(createQuery, user.getUserId(), user.getEmailId(), user.getFirstName(), user.getLastName(),
				passwordEncoder.encode(user.getPassword()), ApprovalStatus.PENDING.name(), user.getPhoneNumber(),
				LocalDateTime.now(), LocalDateTime.now(), user.getUserId(), user.getUserId(), role.getRoleId(),
				project.getProjectId());

		return user;
	}

	@Override
	public User findUserByuserId(int userId) {
		String selectQuery = "SELECT U.USER_ID, U.EMAIL_ID, U.FIRST_NAME, U.LAST_NAME, U.PASSWORD, U.APPROVAL_STATUS, "
				+ "U.PHONE_NUMBER, U.REGISTERED_DATE, U.MODIFIED_DATE, U.PROJECT_ID, P.PROJECT_NAME, "
				+ "R.ROLE_ID, R.ROLE_NAME, U.CREATED_BY, U.MODIFIED_BY, R1.RESTRAIN_ID " + "FROM USER U "
				+ "JOIN `ROLE` R ON U.ROLE_ID = R.ROLE_ID " + "JOIN PROJECT P ON U.PROJECT_ID = P.PROJECT_ID "
				+ "LEFT JOIN RESTRAIN R1 ON U.RESTRAIN_ID = R1.RESTRAIN_ID " + "WHERE U.USER_ID = ?";

		return jdbcTemplate.queryForObject(selectQuery, new UserRowMapper(), userId);
	}

	@Override
	public User getById(int userId) {
		String selectQuery = "SELECT * FROM USER WHERE USER_ID = ?";

		return jdbcTemplate.queryForObject(selectQuery, new UserPrefernceMapper(), userId);
	}

	@Override
	public String createUser(UserModel userModel) {
		String newUser = "INSERT INTO USER (USER_ID, EMAIL_ID, FIRST_NAME, LAST_NAME, PASSWORD, APPROVAL_STATUS, PHONE_NUMBER, REGISTERED_DATE, MODIFIED_DATE, CREATED_BY, MODIFIED_BY, ROLE_ID,PROJECT_ID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
		String firstThreeLetters = userModel.getFirstName().substring(0,
				Math.min(3, userModel.getFirstName().length()));
		String result = firstThreeLetters.substring(0, 1).toUpperCase() + firstThreeLetters.substring(1);
		long phoneNumberLong = userModel.getPhoneNumber();
		String phoneNumber = Long.toString(phoneNumberLong);
		String lastFourDigits = phoneNumber.substring(phoneNumber.length() - 4);
		String finalPassword = result + "@" + lastFourDigits;
		String password = passwordEncoder.encode(finalPassword);
		Role role = roleDAO.getUserRoleByRoleID(2);
		jdbcTemplate.update(newUser, userModel.getUserId(), userModel.getEmailId(), userModel.getFirstName(),
				userModel.getLastName(), password, ApprovalStatus.APPROVED.name(), userModel.getPhoneNumber(),
				LocalDateTime.now(), LocalDateTime.now(), userModel.getUserId(), userModel.getUserId(),
				role.getRoleId(), userModel.getProjectId());

		return "User created successfully";
	}

	@Override
	public boolean isEmailExists(String emailId) {
		String query = "SELECT COUNT(*) FROM USER WHERE EMAIL_ID = ?";
		try {
			Integer count = jdbcTemplate.queryForObject(query, Integer.class, emailId);

			return Objects.nonNull(count) && count > 0;
		} catch (EmptyResultDataAccessException e) {

			return false;
		}
	}

	@Override
	public boolean isEmployeeIdExists(int userId) {
		String query = "SELECT COUNT(*) FROM user WHERE user_id = ?";
		try {
			Integer count = jdbcTemplate.queryForObject(query, Integer.class, userId);

			return Objects.nonNull(count) && count > 0;
		} catch (EmptyResultDataAccessException e) {

			return false;
		}
	}

	@Override
	public void updateUser(UserModel userModel) {
		String sql = "UPDATE USER SET phone_number=?,project_id=?,modified_date=? WHERE user_id=?";
		jdbcTemplate.update(sql, userModel.getPhoneNumber(), userModel.getProjectId(), LocalDate.now(),
				userModel.getUserId());
	}

	@Override
	public User getUserById(int userId) {
		String sql = "SELECT user_id, phone_number, project_id FROM USER WHERE user_id=?";

		return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
			User user = new User();
			user.setUserId(rs.getInt("user_id"));
			user.setPhoneNumber(rs.getLong("phone_number"));

			return user;
		}, (Object) userId);
	}

	@Override
	public List<Map<String, Object>> getUserSeatInfo() throws DataBaseAccessException {
		String sql = "SELECT booking.booking_id, booking.booking_status, user.first_name, user.user_id, seat.seat_number, seat.floor_id, booking.start_date, booking.end_date "
				+ "FROM booking " + "JOIN user ON booking.user_id = user.user_id "
				+ "JOIN seat ON booking.seat_id = seat.seat_id";

		return jdbcTemplate.queryForList(sql);
	}

	@Override
	public List<User> getAllUserDetails(int userId) {
		String sql = "SELECT u.user_id, u.first_name, u.last_name, u.email_id, u.phone_number, p.project_id, p.project_name "
				+ "FROM USER u " + "JOIN project p ON u.project_id = p.project_id " + "WHERE u.user_id = ?";

		return jdbcTemplate.query(sql, new ModifyUserMapper(), userId);
	}

	@Override
	public Integer getSeatIdByNumberAndFloor(int seatNumber, int floorId) {
		String sql = "SELECT seat_id FROM seat WHERE seat_number = ? AND floor_id = ?";
		try {
			return jdbcTemplate.queryForObject(sql, Integer.class, seatNumber, floorId);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	@Override
	public Integer getUserIdByBookingId(int bookingId) {
		String sql = "SELECT user_id FROM booking WHERE booking_id = ?";
		try {
			return jdbcTemplate.queryForObject(sql, Integer.class, bookingId);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	@Override
	public int updateUserSeat(int seatId, int bookingId) throws DataBaseAccessException {
		String sql = "UPDATE BOOKING SET SEAT_ID = ? WHERE BOOKING_ID = ?";

		return jdbcTemplate.update(sql, seatId, bookingId);
	}

	@Override
	public int cancelUserSeat(int bookingId) throws DataBaseAccessException {
		String sql = "UPDATE BOOKING SET BOOKING_STATUS = FALSE WHERE BOOKING_ID = ?";

		return jdbcTemplate.update(sql, bookingId);
	}

	@Override
	public List<BookingMapping> getUserDashboardDetails(int userId) throws DataAccessException {
		String sql = "SELECT b.booking_id, b.start_date, b.end_date,b.booking_status, shift.shift_name, shift.start_time, shift.end_time, b.seat_id, s.floor_id, f.floor_name, bm.lunch, bm.tea_coffee, bm.tea_coffee_type "
				+ "FROM booking b " + "JOIN seat s ON b.seat_id = s.seat_id "
				+ "JOIN shift ON shift.shift_id = b.shift_id " + "JOIN floor f ON s.floor_id = f.floor_id "
				+ "JOIN booking_mapping bm ON bm.booking_id = b.booking_id "
				+ "WHERE b.user_id = ? and bm.booking_date=CURDATE()" + "AND b.booking_status = true";

		return jdbcTemplate.query(sql, new UserDashboardMapper(), (Object) userId);
	}

	@Override
	public List<UserModifyCancelSeat> getBookingDeatilsOfUser(int userId, int seatId) {
		String sql = SELECT + "u.user_Id AS userId, " + "CONCAT(u.first_Name, ' ', u.last_Name) AS userName, "
				+ "b.start_Date AS booking_startDate, " + "b.end_Date AS booking_endDate, "
				+ "s.shift_Name AS shiftName, " + "st.seat_Number AS seatNumber, " + "f.floor_Name AS floorName, "
				+ "b.booking_status AS bookingStatus, " + "u.email_Id AS userEmail " + "FROM " + "User u " + INNER_JOIN
				+ "Booking b ON u.user_Id = b.user_Id " + INNER_JOIN + "Shift s ON b.shift_Id = s.shift_Id "
				+ INNER_JOIN + "Seat st ON b.seat_Id = st.seat_Id " + INNER_JOIN
				+ "Floor f ON st.floor_Id = f.floor_Id " + "WHERE " + "u.user_Id = ? AND st.seat_Id = ?";

		return jdbcTemplate.query(sql, new UpdateSeatBookingMapper(), (Object) userId, seatId);
	}

	@Override
	public List<BookingDetailsOfUserForAdminAndUserReport> getBookingHistoryByUserId(int userId)
			throws DataBaseAccessException {
		String sql = "SELECT CONCAT(U.first_name, ' ', U.last_name) AS user_name,U.user_id,B.booking_type,B.booking_id, "
				+ "S.seat_number,F.floor_name,SH.start_time,SH.end_time,B.start_date,B.booking_status, "
				+ "B.end_date,MAX(BM.tea_coffee_type) AS tea_coffee_type, "
				+ "MAX(BM.parking_type) AS parking_type,MAX(BM.lunch) AS lunch FROM user U "
				+ "JOIN booking B ON U.user_id = B.user_id "
				+ "JOIN booking_mapping BM ON B.booking_id = BM.booking_id JOIN seat S ON B.seat_id = S.seat_id "
				+ "JOIN floor F ON S.floor_id = F.floor_id JOIN shift SH ON B.shift_id = SH.shift_id "
				+ "WHERE U.user_id = ?  GROUP BY U.user_id, S.seat_number, F.floor_name, "
				+ "SH.start_time, SH.end_time, B.start_date, B.end_date,B.booking_type,B.booking_id,B.booking_status;";

		return jdbcTemplate.query(sql, new BookingDetailsOfUserForAdminAndUserReportMapper(), userId);
	}

	public void updateUserPassword(int userId, String password) throws DataAccessException {
		String changePasswordQuery = "UPDATE USER SET PASSWORD=? WHERE user_id=?";
		jdbcTemplate.update(changePasswordQuery, password, userId);
	}

	@Override
	public LocalDateTime getLatestOtpCreationTimeByUserId(int userId) {
		String userOtpTime = "SELECT otp_creation_time FROM otp WHERE user_id = ? ORDER BY otp_creation_time DESC LIMIT 1";

		return jdbcTemplate.queryForObject(userOtpTime, LocalDateTime.class, userId);
	}

	@Override
	public String getLatestOtpByUserId(int userId) {
		String userOtp = "SELECT otp_value FROM otp WHERE user_id = ? ORDER BY otp_creation_time DESC LIMIT 1";

		return jdbcTemplate.queryForObject(userOtp, String.class, userId);
	}

	@Override
	public void saveOtp(Otp otp) {
		String saveOtp = "INSERT INTO otp (user_id, otp_value) VALUES (?, ?)";
		rowsAffected = jdbcTemplate.update(saveOtp, otp.getUser().getUserId(), otp.getOtpValue());
	}

	@Override
	public int getRowsAffected() {
		return rowsAffected;
	}

	@Override
	public void updateUseForgetPassword(int userId, String newPassword) {
		String updateUserPasswordQuery = "UPDATE user SET password = ? WHERE user_id = ?";
		rowsAffected = jdbcTemplate.update(updateUserPasswordQuery, passwordEncoder.encode(newPassword), userId);
	}

	@Override
	public int getSeatIdByBookingId(int bookingId) throws DataBaseAccessException {
		String sql = "SELECT seat_id from booking WHERE booking_id=?";

		return jdbcTemplate.queryForObject(sql, Integer.class, bookingId);
	}

	@Override
	public int setrestrainId(int restrainId, int userId) {
		String sql = "UPDATE USER SET RESTRAIN_ID=? WHERE USER_ID=?";

		return jdbcTemplate.update(sql, restrainId, userId);
	}
}