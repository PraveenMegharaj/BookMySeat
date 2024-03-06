package com.valtech.bookmyseat.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Restrain;
import com.valtech.bookmyseat.entity.User;

public class RestrainMapper implements RowMapper<Restrain> {

	@Override
	public Restrain mapRow(ResultSet rs, int rowNum) throws SQLException {

		Restrain restrain = new Restrain();
		restrain.setRestrainId(rs.getInt("restrain_id"));
		Floor floor = new Floor();
		floor.setFloorId(rs.getInt("floor_id"));
		User user = new User();
		user.setUserId(rs.getInt("user_id"));
		List<User> userList = new ArrayList<>();
		userList.add(user);
		restrain.setUser(userList);
		restrain.setFloor(floor);
		
		return restrain;
	}
}
