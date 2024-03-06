package com.valtech.bookmyseat.daoimpl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.ShiftDAO;
import com.valtech.bookmyseat.entity.Shift;

@Repository
public class ShiftDaoImpl implements ShiftDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<Shift> getAllShiftDetails() {
		String sql = "SELECT * FROM shift";
		List<Shift> shiftDetailsList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Shift.class));

		return shiftDetailsList;
	}

	@Override
	public boolean deleteShiftDetailsById(int shiftId) {
		int rowsAffected = jdbcTemplate.update("DELETE FROM shift WHERE shift_id = ?", shiftId);
		if (rowsAffected > 0) {

			return true;
		} else {
			return false;
		}
	}

	@Override
	public void updateShiftTime(int id, Shift shift) {
		String sql = "UPDATE shift SET shift_name = ?, start_time = ?, end_time = ? WHERE shift_id = ?";
		jdbcTemplate.update(sql, shift.getShiftName(), java.sql.Time.valueOf(shift.getStartTime()),
				java.sql.Time.valueOf(shift.getEndTime()), id);
	}

	@Override
	public void addShiftTime(Shift shift) {
		String sql = "INSERT INTO shift (shift_name, start_time, end_time, created_by, modified_by, created_date, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
		String shiftName = shift.getShiftName();
		LocalTime startTime = shift.getStartTime();
		LocalTime endTime = shift.getEndTime();
		LocalDateTime createdDate = LocalDateTime.now();
		LocalDateTime modifiedDate = LocalDateTime.now();
		String query = "SELECT user_id FROM user WHERE role_id = 1";
		Integer createdBy = jdbcTemplate.queryForObject(query, Integer.class);
		Integer modifiedBy = jdbcTemplate.queryForObject(query, Integer.class);
		jdbcTemplate.update(sql, shiftName, startTime, endTime, createdBy, modifiedBy, createdDate, modifiedDate);
	}

	@Override
	public Shift findShiftByShiftId(int shiftId) {
		String selectQuery = "SELECT * FROM SHIFT WHERE SHIFT_ID = ?";

		return jdbcTemplate.queryForObject(selectQuery, new BeanPropertyRowMapper<>(Shift.class), shiftId);
	}
}