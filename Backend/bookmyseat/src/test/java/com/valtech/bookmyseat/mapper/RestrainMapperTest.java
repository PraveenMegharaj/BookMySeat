package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.entity.Restrain;
import com.valtech.bookmyseat.entity.User;

@ExtendWith(MockitoExtension.class)
class RestrainMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private RestrainMapper restrainMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("restrain_id")).thenReturn(123);
		when(resultSet.getInt("floor_id")).thenReturn(456);
		when(resultSet.getInt("user_id")).thenReturn(789);
		Restrain mappedRestrain = restrainMapper.mapRow(resultSet, 1);
		assertNotNull(mappedRestrain);
		assertEquals(123, mappedRestrain.getRestrainId());
		assertNotNull(mappedRestrain.getFloor());
		assertEquals(456, mappedRestrain.getFloor().getFloorId());
		List<User> userList = mappedRestrain.getUser();
		assertNotNull(userList);
		assertEquals(1, userList.size());
		assertEquals(789, userList.get(0).getUserId());
	}
}
