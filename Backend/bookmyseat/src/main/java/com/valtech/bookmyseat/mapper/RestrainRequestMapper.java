package com.valtech.bookmyseat.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Restrain;

public class RestrainRequestMapper implements RowMapper<Restrain> {

	@Override
	public Restrain mapRow(ResultSet rs, int rowNum) throws SQLException {

		Restrain restrain = new Restrain();
		restrain.setRestrainId(rs.getInt("restrain_id"));
		Floor floor = new Floor();
		floor.setFloorId(rs.getInt("floor_id"));
		restrain.setFloor(floor);

		return restrain;
	}

}
