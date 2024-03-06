package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.entity.Project;

@ExtendWith(MockitoExtension.class)
class ProjectRowMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private ProjectRowMapper projectRowMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("project_id")).thenReturn(1);
		when(resultSet.getString("project_name")).thenReturn("Test Project");
		Project resultProject = projectRowMapper.mapRow(resultSet, 1);
		verify(resultSet).getInt("project_id");
		verify(resultSet).getString("project_name");
		assertEquals(1, resultProject.getProjectId());
		assertEquals("Test Project", resultProject.getProjectName());
	}
}
