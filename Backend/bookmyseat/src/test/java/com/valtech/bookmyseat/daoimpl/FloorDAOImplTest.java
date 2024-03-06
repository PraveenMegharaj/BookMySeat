package com.valtech.bookmyseat.daoimpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.valtech.bookmyseat.daoimpl.FloorDAOImpl.FloorRowMapper;
import com.valtech.bookmyseat.entity.Floor;

@ExtendWith(MockitoExtension.class)
class FloorDAOImplTest {

	@Mock
	private ResultSet resultSet;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@InjectMocks
	private FloorDAOImpl floorDAOImpl;

	@Test
	void testGetFloorById() throws SQLException {
		Floor floor = new Floor();
		floor.setFloorId(1);
		floor.setFloorName("GROUND FLOOR");
		when(jdbcTemplate.queryForObject(eq("SELECT * FROM FLOOR WHERE floor_id = ?"), any(FloorRowMapper.class),
				eq(1))).thenReturn(floor);
		Floor result = floorDAOImpl.getFloorById(1);
		assertEquals(1, result.getFloorId());
		assertEquals("GROUND FLOOR", result.getFloorName());
	}

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("floor_id")).thenReturn(1);
		when(resultSet.getString("floor_name")).thenReturn("Ground Floor");
		FloorRowMapper floorRowMapper = floorDAOImpl.new FloorRowMapper();
		Floor result = floorRowMapper.mapRow(resultSet, 1);
		assertEquals(1, result.getFloorId());
		assertEquals("Ground Floor", result.getFloorName());
	}

	@Test
	void testGetAllFloors() {
		Floor floor = new Floor();
		Floor floor1 = new Floor();
		List<Floor> mockFloors = Arrays.asList(floor, floor1);
		when(jdbcTemplate.query(anyString(), any(FloorRowMapper.class))).thenReturn(mockFloors);
		List<Floor> returnedFloors = floorDAOImpl.getAllFloors();
		verify(jdbcTemplate).query(eq("SELECT * FROM FLOOR"), any(FloorRowMapper.class));
		assertEquals(mockFloors, returnedFloors);
	}
}
