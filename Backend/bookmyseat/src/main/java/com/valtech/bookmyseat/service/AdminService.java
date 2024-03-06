package com.valtech.bookmyseat.service;

import java.util.List;

import com.valtech.bookmyseat.entity.Location;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.Reserved;
import com.valtech.bookmyseat.entity.Restrain;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.exception.EmailException;
import com.valtech.bookmyseat.model.AdminDashBoardModel;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.ProjectModel;
import com.valtech.bookmyseat.model.UserRequestsModel;

/**
 * Service interface for handling admin-related operations.
 */
public interface AdminService {

	/**
	 * Saves a location in the database.
	 *
	 * @param location The Location object to be saved. It should contain all
	 *                 necessary information such as latitude, longitude, address,
	 *                 etc.
	 * @throws DataBaseAccessException If there is an error while saving the
	 *                                 location to the database, this exception will
	 *                                 be thrown. This could occur due to various
	 *                                 reasons such as database connection issues,
	 *                                 SQL errors, etc.
	 */

	void saveLocation(Location location) throws DataBaseAccessException;

	/**
	 * Retrieves daily booking details for the AdminDashboard which includes count
	 * of seat booked,tea/coffee,parking,lunch opted details.
	 * 
	 * @return a list of AdminDashBoardModel objects containing daily booking
	 *         details.
	 * @throws DataBaseAccessException which extends DataAccessException if there is
	 *                                 an issue accessing the data.
	 */
	List<AdminDashBoardModel> fetchAdminDashboardDetails() throws DataBaseAccessException;

	/**
	 * Retrieves a list of user all requests like pending,approved,rejected from the
	 * database.
	 *
	 * @return A list of UserRequestsModel objects representing user requests.
	 * @throws DataBaseAccessException which extends DataAccessException if there is
	 *                                 an issue accessing the data.
	 */
	List<UserRequestsModel> fetchUserRequests() throws DataBaseAccessException;

	/**
	 * Updates the user requests associated with the given userId.
	 * 
	 * @param userRequestsModels a list of UserRequestsModel objects containing the
	 *                           updated user requests data
	 * @param userId             the ID of the user whose requests are to be updated
	 * @return an integer value representing the number of user requests
	 *         successfully updated
	 * @throws DataBaseAccessException if an error occurs while accessing the
	 *                                 database
	 * @throws EmailException          if an error occurs while sending email's to
	 *                                 users
	 */
	int updateUserRequests(List<UserRequestsModel> userRequestsModels, int userId)
			throws DataBaseAccessException, EmailException;

	/**
	 * Creates a new project.
	 *
	 * @param projectModel The ProjectModel object containing details of the new
	 *                     project.
	 * @throws DataBaseAccessException If there is an error occurred during the
	 *                                 database operation.
	 */
	void createNewProject(ProjectModel projectModel) throws DataBaseAccessException;

	/**
	 * Retrieves details of all projects.
	 *
	 * @return List of Project objects containing details of all projects.
	 * @throws DataBaseAccessException If there is an error occurred during the
	 *                                 database operation.
	 */
	List<Project> getAllProjects() throws DataBaseAccessException;

	/**
	 * Deletes a project based on the project ID.
	 *
	 * @param projectId The ID of the project to be deleted.
	 * @throws DataBaseAccessException If there is an error occurred during the
	 *                                 database operation.
	 */
	void deleteProjectById(int projectId) throws DataBaseAccessException;

	/**
	 * Updates an existing project.
	 *
	 * @param projectModel The ProjectModel object containing the updated project
	 *                     details.
	 * @param projectId    The ID of the project to be updated.
	 * @throws DataBaseAccessException If there is an error occurred during the
	 *                                 database operation.
	 */
	void updateProject(ProjectModel projectModel, int projectId) throws DataBaseAccessException;

	/**
	 * Retrieves details of all locations.
	 *
	 * @return List of Location objects containing details of all locations.
	 * @throws DataBaseAccessException If there is an error occurred during the
	 *                                 database operation.
	 */
	List<Location> getAllLocations() throws DataBaseAccessException;

	/**
	 * 
	 * @throws DataBaseAccessException if there is an error occured during the
	 *                                 database operation.
	 */
	void deleteLocation(int locationId) throws DataBaseAccessException;

	/**
	 * 
	 * @param locationModel This model contains the update location details.
	 * @param locationId    the ID of the location to be updated.
	 */
	void updateLocation(Location location, int locationId);

	/**
	 * Reserved seats on a specific floor.
	 *
	 * @return The reserved seat object containing information about the
	 *         reservation.
	 */
	List<Reserved> reservedSeats();

	/**
	 * Reserves a seat for a user on a specific floor.
	 *
	 * @param userId     The ID of the user for whom the seat is being reserved.
	 * @param floorId    The ID of the floor where the seat is located.
	 * @param seatNumber The seatNumber of the seat being reserved.
	 * @throws IllegalArgumentException If userId, floorId, or seatId is negative.
	 */
	int reserveSeat(int userId, int floorId, int seatNumber);

	/**
	 * Retrieves a list of all booking details.
	 *
	 * @return a list containing all booking details
	 */
	List<BookingDetailsOfUserForAdminAndUserReport> getAllBookingDetailsOfUserForAdminReport();

	/**
	 * Restrains users with the given user IDs on the specified floor.
	 *
	 * @param userId  A list of user IDs to be restrained.
	 * @param floorId The ID of the floor where the users will be restrained.
	 */
	void restrainusers(List<Integer> userId, int floorId);

	/**
	 * Retrieves a list of Restrain objects representing the restrained users.
	 *
	 * @return A list of Restrain objects representing the restrained users.
	 */
	List<Restrain> restrainedUsers();

	/**
	 * Retrieves a list of users who have been approved.
	 *
	 * @return A list of approved users.
	 */
	List<User> getApprovedUsers();
}