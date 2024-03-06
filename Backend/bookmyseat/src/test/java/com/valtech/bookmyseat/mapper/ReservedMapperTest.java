package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.entity.Floor;
import com.valtech.bookmyseat.entity.Reserved;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.entity.User;

@ExtendWith(MockitoExtension.class)
class ReservedMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private ReservedMapper reservedMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getBoolean("reserved_status")).thenReturn(true);
		when(resultSet.getInt("reserved_id")).thenReturn(123);
		when(resultSet.getInt("user_id")).thenReturn(456);
		when(resultSet.getString("first_name")).thenReturn("John");
		when(resultSet.getInt("seat_id")).thenReturn(789);
		when(resultSet.getInt("seat_number")).thenReturn(10);
		when(resultSet.getInt("floor_id")).thenReturn(999);
		Reserved reserved = reservedMapper.mapRow(resultSet, 1);
		assertNotNull(reserved);
		assertTrue(reserved.isReservedStatus());
		assertEquals(123, reserved.getReservedId());
		User user = reserved.getUser();
		assertNotNull(user);
		assertEquals(456, user.getUserId());
		assertEquals("John", user.getFirstName());
		Seat seat = reserved.getSeat();
		assertNotNull(seat);
		assertEquals(789, seat.getSeatId());
		assertEquals(10, seat.getSeatNumber());
		Floor floor = seat.getFloor();
		assertNotNull(floor);
		assertEquals(999, floor.getFloorId());
	}
}
