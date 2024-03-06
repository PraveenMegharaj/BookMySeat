package com.valtech.bookmyseat.dao;

import java.util.List;

import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.exception.DataBaseAccessException;

/**
 * This interface defines the operations that can be performed on a Project data
 * access object (DAO). It provides methods for creating, retrieving, updating,
 * and deleting projects.
 */
public interface ProjectDAO {
	/**
	 * Creates a new project in the database.
	 *
	 * @param project The project object to be created. It should contain all
	 *                necessary information such as project name, description, start
	 *                date, end date, etc.
	 * @return An integer indicating the result of the creation operation.
	 *         Typically, this value could represent an identifier for the newly
	 *         created project or a status code indicating success or failure.
	 * @throws DataBaseAccessException If there is an error while accessing the
	 *                                 database to create the project
	 */
	int createProject(Project project) throws DataBaseAccessException;

	/**
	 * Retrieves a list of all projects from the data store.
	 * 
	 * @return A list of Project objects representing all projects.
	 */
	List<Project> getAllProjects() throws DataBaseAccessException;

	/**
	 * Retrieves a project by its name from the data store.
	 * 
	 * @param projectName The name of the project to retrieve.
	 * @return The Project object with the specified name, or null if not found.
	 */
	Project getProjectByName(String projectName);

	/**
	 * Deletes a project from the system based on the provided project ID.
	 *
	 * @param projectId The unique identifier of the project to be deleted.
	 * @return An integer representing the status of the deletion operation. This
	 *         value typically indicates success or failure of the deletion process.
	 *         It might return the number of affected rows, or a specific code
	 *         indicating success or failure.
	 * @throws DataBaseAccessException If there is an error accessing the database
	 *                                 while trying to delete the project, this
	 *                                 exception will be thrown. This could occur
	 *                                 due to connectivity issues, database
	 *                                 constraints, or other database-related
	 *                                 errors.
	 */
	int deleteProjectById(int projectId) throws DataBaseAccessException;

	/**
	 * Updates an existing project in the system with the provided project
	 * information.
	 *
	 * @param project   The project object containing the updated information. It
	 *                  should include all necessary fields to update the project
	 *                  such as name, description, start date, end date, etc.
	 * @param projectId The unique identifier of the project to be updated.
	 * @return An integer representing the status of the update operation.
	 *         Typically, this value could indicate the number of rows affected by
	 *         the update operation, or it could represent a success/failure status
	 *         code.
	 * @throws DataBaseAccessException If there is an error accessing the database
	 *                                 while performing the update operation, this
	 *                                 exception will be thrown. This could happen
	 *                                 due to connection issues, SQL errors, etc.
	 */
	int updateProject(Project project, int projectId) throws DataBaseAccessException;

	/**
	 * Retrieves the project with the specified project ID.
	 * 
	 * @param projectId The ID of the project to retrieve.
	 * @return The project object corresponding to the provided project ID, or null
	 *         if no project is found.
	 */
	Project getProjectById(int projectId);
}
