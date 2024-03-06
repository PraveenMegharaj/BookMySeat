package com.valtech.bookmyseat.daoimpl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.AdminDAO;
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

@Repository
public class AdminDaoImpl implements AdminDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private SeatDAO seatDAO;

	@Override
	public List<AdminDashBoardModel> fetchAdminDashboardDetails() throws DataBaseAccessException {
		String sql = "SELECT " + "COUNT(DISTINCT b.seat_id) AS seats_booked, " + "SUM(bm.lunch) AS total_lunch_booked, "
				+ "SUM(CASE WHEN bm.tea_coffee_type = 'TEA' THEN 1 ELSE 0 END) AS total_tea_booked, "
				+ "SUM(CASE WHEN bm.tea_coffee_type = 'COFFEE' THEN 1 ELSE 0 END) AS total_coffee_booked, "
				+ "SUM(bm.parking) AS total_parking_booked, "
				+ "SUM(CASE WHEN bm.parking_type = 'TWO_WHEELER' THEN 1 ELSE 0 END) AS total_two_wheeler_parking_booked, "
				+ "SUM(CASE WHEN bm.parking_type = 'FOUR_WHEELER' THEN 1 ELSE 0 END) AS total_four_wheeler_parking_booked, "
				+ "SUM(CASE WHEN bm.additional_desktop = 1 THEN 1 ELSE 0 END) AS total_desktop_booked "
				+ "FROM booking b " + "JOIN booking_mapping bm ON b.booking_id = bm.booking_id "
				+ "WHERE b.start_date <= CURDATE() AND b.end_date >= CURDATE()";

		return jdbcTemplate.query(sql, new AdminDashBoardMapper());
	}

	@Override
	public List<UserRequestsModel> fetchUserRequests() throws DataBaseAccessException {
		String sql = "SELECT CONCAT(first_name, ' ', last_name) AS name,user_id,email_id,registered_date,approval_status"
				+ " FROM user" + " WHERE approval_status IN ('PENDING', 'APPROVED', 'REJECTED') AND role_id=2";

		return jdbcTemplate.query(sql, new UserRequestsMapper());
	}

	@Override
	public int updateUserRequests(User user, int userId) throws DataBaseAccessException {
		String sql = "UPDATE user SET approval_status = ?,modified_by=?,modified_date=? WHERE user_id = ?";

		return jdbcTemplate.update(sql, String.valueOf(user.getApprovalStatus()), userId, LocalDate.now(),
				user.getUserId());
	}

	@Override
	public List<BookingDetailsOfUserForAdminAndUserReport> getAllBookingDetailsOfUserForAdminReport() {
		String sql = "SELECT CONCAT(U.first_name, ' ', U.last_name) AS user_name,U.user_id,S.seat_number,B.booking_id,B.booking_status, "
				+ "F.floor_name,SH.start_time, SH.end_time,B.start_date, "
				+ "B.end_date, B.booking_type,MAX(BM.tea_coffee_type) AS tea_coffee_type, "
				+ "MAX(BM.parking_type) AS parking_type, MAX(BM.lunch) AS lunch FROM user U "
				+ "JOIN booking B ON U.user_id = B.user_id "
				+ "JOIN booking_mapping BM ON B.booking_id = BM.booking_id " + "JOIN seat S ON B.seat_id = S.seat_id "
				+ "JOIN floor F ON S.floor_id = F.floor_id JOIN shift SH ON B.shift_id = SH.shift_id "
				+ "GROUP BY U.user_id, S.seat_number, F.floor_name, SH.start_time, SH.end_time, B.start_date, B.end_date,B.booking_type,b.booking_id,B.booking_status;";

		return jdbcTemplate.query(sql, new BookingDetailsOfUserForAdminAndUserReportMapper());
	}

	@Override
	public List<Reserved> reserveSeat() throws DataBaseAccessException {
		String sql = "SELECT user.user_id, user.first_name, reserved.reserved_status, reserved.reserved_id, seat.seat_id, seat.seat_number, seat.floor_id "
				+ "FROM user " + "JOIN reserved ON user.user_id = reserved.user_id "
				+ "JOIN seat ON reserved.seat_id = seat.seat_id " + "WHERE reserved.reserved_status = true";

		return jdbcTemplate.query(sql, new ReservedMapper());
	}

	@Override
	public int reserveSeatInDB(int userId, int floorId, int seatNumber) throws DataBaseAccessException {
		int seatId = seatDAO.findSeatId(seatNumber, floorId);
		String sql = "INSERT INTO reserved (user_id, seat_id, reserved_status) VALUES (?, ?,?)";

		return jdbcTemplate.update(sql, userId, seatId, true);
	}

	@Override
	public Restrain restrain(int floorId) throws DataBaseAccessException {
		String sql = "SELECT * FROM restrain WHERE floor_id = ?";

		return jdbcTemplate.queryForObject(sql, new RestrainRequestMapper(), (Object) floorId);
	}

	@Override
	public int getRestrainId(int floorId) throws DataBaseAccessException {
		String sql = "SELECT restrain_id FROM restrain WHERE floor_id = ?";

		Integer restrainId = jdbcTemplate.queryForObject(sql, Integer.class, floorId);
		return restrainId != null ? restrainId : -1;
	}

	@Override
	public List<Restrain> restrainedUsers() throws DataBaseAccessException {
		String qry = "SELECT U.USER_ID, CONCAT(U.FIRST_NAME,' ',U.LAST_NAME) AS USER_NAME,U.RESTRAIN_ID,R.RESTRAIN_STATUS,R.FLOOR_ID "
				+ "FROM RESTRAIN R " + "JOIN USER U ON U.RESTRAIN_ID = R.RESTRAIN_ID ";

		return jdbcTemplate.query(qry, new RestrainMapper());
	}

	@Override
	public List<User> findApprovedUsers() throws DataBaseAccessException {
		String sql = "SELECT user_id, first_name, last_name, email_id, project_id, restrain_id " + "FROM user "
				+ "WHERE approval_status = 'APPROVED'";

		return jdbcTemplate.query(sql, new UserApprovedMapper());
	}
}