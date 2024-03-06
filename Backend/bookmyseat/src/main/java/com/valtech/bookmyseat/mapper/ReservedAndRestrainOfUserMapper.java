package com.valtech.bookmyseat.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;

public class ReservedAndRestrainOfUserMapper implements RowMapper<RestrainReserveOfUsersModel> {

	@Override
	public RestrainReserveOfUsersModel mapRow(ResultSet rs, int rowNum) throws SQLException {
		RestrainReserveOfUsersModel restrainReserveOfUsersModel = new RestrainReserveOfUsersModel();
		restrainReserveOfUsersModel.setUserId(rs.getInt("user_id"));
		restrainReserveOfUsersModel.setReservedId(rs.getInt("reserved_id"));
		restrainReserveOfUsersModel.setReservedStatus(rs.getBoolean("reserved_status"));
		restrainReserveOfUsersModel.setSeatNumber(rs.getInt("seat_number"));
		restrainReserveOfUsersModel.setFloorId(rs.getInt("floor_id"));

		return restrainReserveOfUsersModel;
	}

}
