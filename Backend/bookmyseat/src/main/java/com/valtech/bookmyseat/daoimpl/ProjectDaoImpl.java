package com.valtech.bookmyseat.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.valtech.bookmyseat.dao.ProjectDAO;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.mapper.ProjectRowMapper;

@Repository
public class ProjectDaoImpl implements ProjectDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public Project getProjectById(int projectId) {
		String selectQuery = "SELECT * FROM PROJECT WHERE PROJECT_ID = ?";

		return jdbcTemplate.queryForObject(selectQuery, new ProjectRowMapper(), projectId);
	}

	@Override
	public Project getProjectByName(String projectName) {
		String selectQuery = "SELECT * FROM PROJECT WHERE PROJECT_NAME = ?";

		return jdbcTemplate.queryForObject(selectQuery, new BeanPropertyRowMapper<>(Project.class), projectName);
	}

	@Override
	public int createProject(Project project) throws DataBaseAccessException {
		String insertQuery = "INSERT INTO PROJECT (PROJECT_NAME, CREATED_DATE, MODIFIED_DATE, CREATED_BY, MODIFIED_BY) VALUES (?,?,?,?,?)";

		return jdbcTemplate.update(insertQuery, project.getProjectName(), project.getCreatedDate(),
				project.getModifiedDate(), project.getCreatedBy(), project.getModifiedBy());
	}

	@Override
	public List<Project> getAllProjects() throws DataBaseAccessException {
		String selectQuery = "SELECT * FROM PROJECT";

		return jdbcTemplate.query(selectQuery, new BeanPropertyRowMapper<>(Project.class));
	}

	@Override
	public int deleteProjectById(int projectId) throws DataBaseAccessException {
		String deleteQuery = "DELETE FROM PROJECT WHERE PROJECT_ID = ?";

		return jdbcTemplate.update(deleteQuery, projectId);
	}

	@Override
	public int updateProject(Project project, int projectId) throws DataBaseAccessException {
		String updateQuery = "UPDATE PROJECT SET PROJECT_NAME = ?, MODIFIED_DATE = ?, MODIFIED_BY = ? WHERE PROJECT_ID = ?";

		return jdbcTemplate.update(updateQuery, project.getProjectName(), project.getModifiedDate(),
				project.getModifiedBy(), projectId);
	}
}
