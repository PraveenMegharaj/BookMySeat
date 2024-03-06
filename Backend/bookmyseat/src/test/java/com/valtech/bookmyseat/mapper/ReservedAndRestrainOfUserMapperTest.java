package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;

@ExtendWith(MockitoExtension.class)
class ReservedAndRestrainOfUserMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private ReservedAndRestrainOfUserMapper reservedAndRestrainOfUserMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("user_id")).thenReturn(123);
		when(resultSet.getInt("reserved_id")).thenReturn(456);
		when(resultSet.getBoolean("reserved_status")).thenReturn(true);
		when(resultSet.getInt("seat_number")).thenReturn(789);
		when(resultSet.getInt("floor_id")).thenReturn(321);
		RestrainReserveOfUsersModel result = reservedAndRestrainOfUserMapper.mapRow(resultSet, 1);
		assertEquals(123, result.getUserId());
		assertEquals(456, result.getReservedId());
		assertEquals(true, result.isReservedStatus());
		assertEquals(789, result.getSeatNumber());
		assertEquals(321, result.getFloorId());
	}
}
