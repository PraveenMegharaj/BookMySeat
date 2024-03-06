package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.entity.Restrain;

@ExtendWith(MockitoExtension.class)
class RestrainRequestMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private RestrainRequestMapper restrainRequestMapper;

	@Test
	void testMapRow() throws SQLException {
		int expectedRestrainId = 1;
		int expectedFloorId = 2;
		when(resultSet.getInt("restrain_id")).thenReturn(expectedRestrainId);
		when(resultSet.getInt("floor_id")).thenReturn(expectedFloorId);
		Restrain mappedRestrain = restrainRequestMapper.mapRow(resultSet, 1);
		assertEquals(expectedRestrainId, mappedRestrain.getRestrainId());
		assertEquals(expectedFloorId, mappedRestrain.getFloor().getFloorId());
		verify(resultSet).getInt("restrain_id");
		verify(resultSet).getInt("floor_id");
		verifyNoMoreInteractions(resultSet);
	}
}
