package com.valtech.bookmyseat.daoimpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.BookingDAO;
import com.valtech.bookmyseat.dao.UserDAO;
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

@Repository
public class BookingDAOImpl implements BookingDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private UserDAO userDAO;

	public class BookingRowMapper implements RowMapper<Booking> {

		@Override
		public Booking mapRow(ResultSet rs, int rowNum) throws SQLException {
			Booking booking = new Booking();
			booking.setBookingId(rs.getInt("BOOKING_ID"));
			booking.setStartDate(rs.getDate("START_DATE").toLocalDate());
			booking.setEndDate(rs.getDate("END_DATE").toLocalDate());
			booking.setBookingType(BookingType.valueOf(rs.getString("BOOKING_TYPE")));
			booking.setBookingStatus(rs.getBoolean("BOOKING_STATUS"));
			booking.setUser(userDAO.findUserByuserId(rs.getInt("USER_ID")));
			Floor floor = new Floor();
			floor.setFloorId(rs.getInt("floor_id"));
			Seat seat = new Seat();
			seat.setSeatId(rs.getInt("seat_id"));
			seat.setSeatNumber(rs.getInt("seat_number"));
			seat.setFloor(floor);
			booking.setSeat(seat);

			return booking;
		}
	}

	@Override
	public List<Booking> userPreferredSeats(int floorId, int projectId) {
		String selectQuery = "SELECT B.*, S.FLOOR_ID, S.SEAT_NUMBER " + "FROM BOOKING B "
				+ "JOIN BOOKING_MAPPING BM ON B.BOOKING_ID = BM.BOOKING_ID " + "JOIN SEAT S ON B.SEAT_ID = S.SEAT_ID "
				+ "WHERE BM.BOOKING_DATE = CURDATE() " + "AND S.FLOOR_ID = ? "
				+ "AND B.USER_ID IN (SELECT U.USER_ID FROM USER U WHERE U.PROJECT_ID = ?)";

		return jdbcTemplate.query(selectQuery, new BookingRowMapper(), floorId, projectId);
	}

	@Override
	public int createBooking(BookingModel booking, User user, Seat seat, Shift shift) throws DataBaseAccessException {
		String insertQuery = "INSERT INTO BOOKING(BOOKING_TYPE , START_DATE, END_DATE, USER_ID, SHIFT_ID, SEAT_ID, BOOKING_STATUS) VALUES (?,?,?,?,?,?,?)";
		jdbcTemplate.update(insertQuery, booking.getBookingType().toString(), booking.getStartDate(),
				booking.getEndDate(), user.getUserId(), shift.getShiftId(), seat.getSeatId(), true);
		Integer lastInsertId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
		
		return lastInsertId != null ? lastInsertId : -1;
	}

	@Override
	public void createBookingMapping(BookingModel booking, int bookingId) {
		String insertQuery = "INSERT INTO BOOKING_MAPPING (BOOKING_DATE, BOOKING_ID, ADDITIONAL_DESKTOP, LUNCH, TEA_COFFEE, TEA_COFFEE_TYPE, PARKING, PARKING_TYPE) VALUES (?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(insertQuery, booking.getBookingDate(), bookingId, booking.getAdditionalDesktop(),
				booking.getLunch(), booking.getTeaCoffee(), booking.getTeaCoffeeType(), booking.getParkingOpted(),
				booking.getParkingType());
	}

	@Override
	public List<BookingMapping> getAllBookingDetails() throws DataAccessException {
		String sql = "SELECT " + "b.booking_id, " + "b.booking_type, " + "b.start_date, " + "b.end_date, "
				+ "b.booking_status, " + "s.seat_id, " + "l.location_name, " + "l.location_id, " + "s.floor_id, "
				+ "f.floor_name, " + "sh.shift_name, " + "sh.start_time, " + "sh.end_time, " + "u.first_name, "
				+ "u.user_id, " + "p.project_name, " + "p.project_id, " + "u.approval_status, " + "bm.marked_status "
				+ "FROM " + "booking b " + "JOIN booking_mapping bm ON b.booking_id = bm.booking_id "
				+ "JOIN seat s ON b.seat_id = s.seat_id " + "JOIN floor f ON s.floor_id = f.floor_id " + "JOIN "
				+ "location l ON f.location_id = l.location_id " + "JOIN shift sh ON b.shift_id = sh.shift_id "
				+ "JOIN user u ON b.user_id = u.user_id " + "JOIN project p ON u.project_id = p.project_id "
				+ "WHERE " + "bm.booking_date = CURDATE() " + "AND bm.marked_status = false "
				+ "AND b.booking_status = true";

		return jdbcTemplate.query(sql, new AttendanceRowMapper());
	}

	@Override
	public void approvalAttendance(int userId) {
		String sql = "UPDATE booking_mapping AS bm " + "INNER JOIN booking AS b ON bm.booking_id = b.booking_id "
				+ "SET bm.marked_status = ?, " + "bm.booking_date = CURDATE() " + "WHERE b.user_id = ?";
		jdbcTemplate.update(sql, true, userId);
	}

	@Override
	public boolean hasAlreadyBookedForDate(int userId, LocalDate startDate, LocalDate endDate)
			throws DataBaseAccessException {
		String selectQuery = "SELECT COUNT(*) FROM BOOKING WHERE USER_ID = ? AND ((START_DATE <= ? AND END_DATE >= ?) OR (START_DATE >= ? AND END_DATE <= ?)) AND BOOKING_STATUS = true";
		Integer existingUserId = jdbcTemplate.queryForObject(selectQuery, Integer.class, userId, startDate, endDate,
				startDate, endDate);
		int count = existingUserId != null ? existingUserId : -1;

		return count > 0;
	}

	@Override
	public List<BookedSeatModel> getAllBookedSeat(LocalDate startDate, LocalDate endDate)
			throws DataBaseAccessException {
		String sql = "SELECT S.seat_number,S.floor_id,B.booking_id,B.booking_status,B.start_date,B.end_date,U.user_id "
				+ "FROM user U " + "JOIN booking B ON U.user_id = B.user_id " + "JOIN seat S ON S.seat_id=B.seat_id "
				+ "WHERE ((b.START_DATE <= ? AND b.END_DATE >= ?) OR (b.START_DATE >= ? AND b.END_DATE <= ?)) AND BOOKING_STATUS = true";

		return jdbcTemplate.query(sql, new BookedSeatRowMapper(), (Object) startDate, endDate, startDate, endDate);
	}

	@Override
	public List<RestrainReserveOfUsersModel> getReservedRestrainDetailsOfUsers() throws DataBaseAccessException {
		String sql = "SELECT U.user_id, S.seat_number,S.floor_id,R.reserved_id, R.reserved_status " + "FROM user U "
				+ "JOIN reserved R ON R.user_id=U.user_id JOIN seat S ON s.seat_id = R.seat_id";

		return jdbcTemplate.query(sql, new ReservedAndRestrainOfUserMapper());
	}
}