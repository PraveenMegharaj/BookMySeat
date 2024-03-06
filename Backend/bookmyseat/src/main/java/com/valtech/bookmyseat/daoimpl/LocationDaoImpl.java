package com.valtech.bookmyseat.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.LocationDAO;
import com.valtech.bookmyseat.entity.Location;
import com.valtech.bookmyseat.exception.DataBaseAccessException;

@Repository
public class LocationDaoImpl implements LocationDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public int save(Location location) throws DataBaseAccessException {
		String insertQuery = "INSERT INTO LOCATION (LOCATION_NAME) VALUES (?)";
		
		return jdbcTemplate.update(insertQuery, location.getLocationName());
	}

	@Override
	public List<Location> getAllLocation() throws DataBaseAccessException {
		String selectQry = "SELECT * FROM LOCATION";

		return jdbcTemplate.query(selectQry, new BeanPropertyRowMapper<>(Location.class));
	}

	@Override
	public int deleteLocation(int locationId) throws DataBaseAccessException{
		String deleteQry = "DELETE FROM LOCATION WHERE LOCATION_ID=?";
				
		return jdbcTemplate.update(deleteQry, locationId);
	}

	@Override
	public int updateLocation(Location location, int locationId) throws DataBaseAccessException {
		String updateQry = "UPDATE LOCATION SET LOCATION_NAME = ? WHERE LOCATION_ID=?";

		return jdbcTemplate.update(updateQry, location.getLocationName(), locationId);
	}
}