package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.dao.FloorDAO;
import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Seat;

@ExtendWith(MockitoExtension.class)
class SeatRowMapperTest {

	@Mock
	private ResultSet resultSet;

	@Mock
	private FloorDAO floorDAO;

	@InjectMocks
	private SeatRowMapper seatRowMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("seat_id")).thenReturn(1);
		when(resultSet.getInt("seat_number")).thenReturn(10);
		when(resultSet.getInt("floor_id")).thenReturn(5);
		Floor floor = new Floor();
		when(floorDAO.getFloorById(5)).thenReturn(floor);
		Seat result = seatRowMapper.mapRow(resultSet, 1);
		assertNotNull(result);
		assertEquals(1, result.getSeatId());
		assertEquals(10, result.getSeatNumber());
		assertFalse(result.isSeatStatus());
		assertEquals(floor, result.getFloor());
	}
}
