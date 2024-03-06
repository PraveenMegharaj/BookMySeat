package com.valtech.bookmyseat.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.User;

public class UserApprovedMapper implements RowMapper<User> {

	@Override
	public User mapRow(ResultSet rs, int rowNum) throws SQLException {
		User user = new User();
        user.setUserId(rs.getInt("user_id"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setEmailId(rs.getString("email_id"));
        Project project = new Project();
		project.setProjectId(rs.getInt("project_id"));
		user.setProject(project);
		
        return user;
	}
}
