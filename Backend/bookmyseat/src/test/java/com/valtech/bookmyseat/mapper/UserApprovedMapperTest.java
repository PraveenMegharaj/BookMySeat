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

import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.User;

@ExtendWith(MockitoExtension.class)
class UserApprovedMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private UserApprovedMapper userApprovedMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("user_id")).thenReturn(1);
		when(resultSet.getString("first_name")).thenReturn("John");
		when(resultSet.getString("last_name")).thenReturn("Doe");
		when(resultSet.getString("email_id")).thenReturn("john.doe@example.com");
		when(resultSet.getInt("project_id")).thenReturn(101);
		User user = userApprovedMapper.mapRow(resultSet, 1);
		assertEquals(1, user.getUserId());
		assertEquals("John", user.getFirstName());
		assertEquals("Doe", user.getLastName());
		assertEquals("john.doe@example.com", user.getEmailId());
		Project project = user.getProject();
		assertEquals(101, project.getProjectId());
	}
}
