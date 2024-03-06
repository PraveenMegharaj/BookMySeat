package com.valtech.bookmyseat.daoimpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.valtech.bookmyseat.dao.FloorDAO;
import com.valtech.bookmyseat.daoimpl.SeatDAOImpl.SeatRowMapper;
import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.exception.DataBaseAccessException;

@ExtendWith(MockitoExtension.class)
class SeatDAOImplTest {

	@Mock
	private ResultSet resultSet;

	@Mock
	private FloorDAO floorDAO;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@InjectMocks
	private SeatDAOImpl seatDAOImpl;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("seat_id")).thenReturn(1);
		when(resultSet.getInt("seat_number")).thenReturn(10);
		when(resultSet.getInt("floor_id")).thenReturn(100);
		Floor floor = new Floor();
		when(floorDAO.getFloorById(100)).thenReturn(floor);
		SeatRowMapper seatRowMapper = seatDAOImpl.new SeatRowMapper();
		Seat seat = seatRowMapper.mapRow(resultSet, 1);
		verify(resultSet).getInt("seat_id");
		verify(resultSet).getInt("seat_number");
		verify(resultSet).getInt("floor_id");
		verify(floorDAO).getFloorById(100);
		assertEquals(1, seat.getSeatId());
		assertEquals(10, seat.getSeatNumber());
		assertEquals(floor, seat.getFloor());
	}

	@Test
	void testFindAvailableSeatsByFloorOnDate() {
		List<Seat> mockSeats = new ArrayList<>();
		when(jdbcTemplate.query(anyString(), any(SeatRowMapper.class), anyInt(), any(LocalDate.class),
				any(LocalDate.class), any(LocalDate.class), any(LocalDate.class), any(LocalDate.class),
				any(LocalDate.class), any(LocalDate.class), any(LocalDate.class))).thenReturn(mockSeats);
		int floorId = 1;
		LocalDate startDate = LocalDate.of(2024, 2, 1);
		LocalDate endDate = LocalDate.of(2024, 2, 28);
		List<Seat> availableSeats = seatDAOImpl.findAvailableSeatsByFloorOnDate(floorId, startDate, endDate);
		verify(jdbcTemplate).query(anyString(), any(SeatRowMapper.class), eq(floorId), eq(startDate), eq(endDate),
				eq(startDate), eq(endDate), eq(startDate), eq(endDate), eq(startDate), eq(endDate));
		assertEquals(mockSeats, availableSeats);
	}

	@Test
	void testFindSeatById() {
		Floor floor = new Floor();
		floor.setFloorId(2);
		Seat expectedSeat = new Seat();
		expectedSeat.setSeatNumber(1);
		expectedSeat.setFloor(floor);
		when(jdbcTemplate.queryForObject(anyString(), any(SeatRowMapper.class), anyInt(), anyInt()))
				.thenReturn(expectedSeat);
		Seat resultSeat = seatDAOImpl.findSeatById(1, 2);
		assertNotNull(resultSeat);
		assertEquals(expectedSeat.getSeatNumber(), resultSeat.getSeatNumber());
		assertEquals(expectedSeat.getFloor().getFloorId(), resultSeat.getFloor().getFloorId());
		verify(jdbcTemplate).queryForObject(anyString(), any(SeatRowMapper.class), eq(1), eq(2));
	}

	@Test
	void testFindSeatId() throws DataBaseAccessException {
		int expectedSeatId = 123;
		int seatNumber = 1;
		int floorId = 2;
		String sql = "SELECT seat_id FROM seat WHERE seat_number = ? AND floor_id = ?";
		when(jdbcTemplate.queryForObject(sql, Integer.class, seatNumber, floorId)).thenReturn(expectedSeatId);
		int actualSeatId = seatDAOImpl.findSeatId(seatNumber, floorId);
		assertEquals(expectedSeatId, actualSeatId);
		verify(jdbcTemplate).queryForObject(sql, Integer.class, seatNumber, floorId);
	}

	@Test
	void testFindSeatId_NoSeatFound() throws DataBaseAccessException {
		int seatNumber = 1;
		int floorId = 2;
		String sql = "SELECT seat_id FROM seat WHERE seat_number = ? AND floor_id = ?";
		when(jdbcTemplate.queryForObject(sql, Integer.class, seatNumber, floorId)).thenReturn(null);
		int actualSeatId = seatDAOImpl.findSeatId(seatNumber, floorId);
		assertEquals(-1, actualSeatId);
		verify(jdbcTemplate).queryForObject(sql, Integer.class, seatNumber, floorId);
	}
}
