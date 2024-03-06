package com.valtech.bookmyseat.mapper;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.dao.ProjectDAO;
import com.valtech.bookmyseat.dao.RoleDAO;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.Role;

@ExtendWith(MockitoExtension.class)
class UserPrefernceMapperTest {

	@Mock
	private RoleDAO roleDAO;

	@Mock
	private ProjectDAO projectDAO;

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private UserPrefernceMapper userPrefernceMapper;

	@Test
	void testMapRow() throws SQLException {
		when(roleDAO.getUserRoleByRoleID(anyInt())).thenReturn(new Role());
		when(projectDAO.getProjectById(anyInt())).thenReturn(new Project());
		when(resultSet.getInt("user_id")).thenReturn(1);
		when(resultSet.getString("email_id")).thenReturn("test@example.com");
		when(resultSet.getString("first_name")).thenReturn("John");
		when(resultSet.getString("last_name")).thenReturn("Doe");
		when(resultSet.getString("password")).thenReturn("password123");
		when(resultSet.getLong("phone_number")).thenReturn(1234567890L);
		when(resultSet.getInt("role_id")).thenReturn(1);
		when(resultSet.getInt("project_id")).thenReturn(1);
		userPrefernceMapper.mapRow(resultSet, 1);
		verify(resultSet).getInt("user_id");
		verify(resultSet).getString("email_id");
		verify(resultSet).getString("first_name");
		verify(resultSet).getString("last_name");
		verify(resultSet).getString("password");
		verify(resultSet).getLong("phone_number");
		verify(resultSet).getInt("role_id");
		verify(resultSet).getInt("project_id");
	}

}
