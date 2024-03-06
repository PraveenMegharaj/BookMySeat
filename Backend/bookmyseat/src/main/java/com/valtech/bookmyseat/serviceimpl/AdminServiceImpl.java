package com.valtech.bookmyseat.serviceimpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.valtech.bookmyseat.dao.AdminDAO;
import com.valtech.bookmyseat.dao.LocationDAO;
import com.valtech.bookmyseat.dao.ProjectDAO;
import com.valtech.bookmyseat.dao.UserDAO;
import com.valtech.bookmyseat.entity.ApprovalStatus;
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
import com.valtech.bookmyseat.service.AdminService;
import com.valtech.bookmyseat.service.EmailService;

@Service
public class AdminServiceImpl implements AdminService {
	private static final Logger LOGGER = LoggerFactory.getLogger(AdminServiceImpl.class);

	@Autowired
	private AdminDAO adminDAO;

	@Autowired
	private ProjectDAO projectDAO;

	@Autowired
	private EmailService emailService;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private LocationDAO locationDAO;

	public List<AdminDashBoardModel> fetchAdminDashboardDetails() throws DataBaseAccessException {
		LOGGER.info("Fetching the daily booking details...");
		List<AdminDashBoardModel> dailyBookingDetails = adminDAO.fetchAdminDashboardDetails();
		if (Objects.isNull(dailyBookingDetails)) {
			throw new DataBaseAccessException("Error occurred while fetching Daily Booking Details...");
		}
		LOGGER.info("Successfully fetched daily booking details....");

		return dailyBookingDetails;
	}

	@Override
	public List<UserRequestsModel> fetchUserRequests() throws DataBaseAccessException {
		LOGGER.info("Fetching User Requests....");
		List<UserRequestsModel> userRequests = adminDAO.fetchUserRequests();
		if (Objects.isNull(userRequests)) {
			throw new DataBaseAccessException("Error occurred while fetching User Requests...");
		}
		LOGGER.info("Successfully fetched User Requests....");

		return userRequests;
	}

	@Override
	public int updateUserRequests(List<UserRequestsModel> userRequestsModels, int userId)
			throws DataBaseAccessException, EmailException {
		LOGGER.info("Updating multiple User approval requests...");
		if (Objects.isNull(userRequestsModels) || userRequestsModels.isEmpty()) {
			throw new IllegalArgumentException("userRequestsModels cannot be null or empty...");
		}
		int totalRowsUpdated = 0;
		for (UserRequestsModel userRequestsModel : userRequestsModels) {
			if (Objects.isNull(userRequestsModel)) {
				LOGGER.warn("userRequestsModel cannot be null");
				continue;
			}
			LOGGER.info("updating the User approval request of User}");
			LOGGER.debug("Updating the User approval request for User {} with Approval Status {}",
					userRequestsModel.getUserID(), userRequestsModel.getApprovalStatus());
			User user = new User();
			user.setUserId(userRequestsModel.getUserID());
			user.setApprovalStatus(ApprovalStatus.valueOf(userRequestsModel.getApprovalStatus()));
			int rowsUpdated = adminDAO.updateUserRequests(user, userId);
			if (rowsUpdated == 0) {
				throw new DataBaseAccessException("Failed to update user request. No rows were updated.");
			}
			LOGGER.info("Successfully updated the User approval request of User");
			LOGGER.debug("Successfully updated the approval status for User: {} with Approval Status: {}...",
					userRequestsModel.getUserID(), userRequestsModel.getApprovalStatus());
			user = userDAO.findUserByuserId(userRequestsModel.getUserID());
			try {
				if ("APPROVED".equals(userRequestsModel.getApprovalStatus())) {
					emailService.sendApprovalEmailToUser(user);
				} else {
					emailService.sendRejectionEmailToUser(user);
				}
			} catch (Exception e) {
				LOGGER.error("Error sending email for User {}. Error: {}", userRequestsModel.getUserID(),
						e.getMessage());
			}
			totalRowsUpdated += rowsUpdated;
		}
		LOGGER.info("Successfully updated approval statuses for {} users.", totalRowsUpdated);

		return totalRowsUpdated;
	}

	@Override
	public void createNewProject(ProjectModel projectModel) throws DataBaseAccessException {
		LOGGER.info("Creating new Project by the name: {}", projectModel.getProjectName());
		Project project = projectModel.getProjectDetails();
		int rowUpdated = projectDAO.createProject(project);
		if (rowUpdated < 0)
			throw new DataBaseAccessException("Error occured while creating new Project");
		LOGGER.info("Successfully added the project with name:{}", project.getProjectName());
	}

	@Override
	public List<Project> getAllProjects() throws DataBaseAccessException {
		LOGGER.info("Retrieving all Projects");

		List<Project> projects = projectDAO.getAllProjects();
		if (Objects.isNull(projects))
			throw new DataBaseAccessException("Error occured while fetching the projects");
		LOGGER.info("Successfully fetched all projects");

		return projects;
	}

	@Override
	public void deleteProjectById(int projectId) throws DataBaseAccessException {
		LOGGER.info("Deleting project by Id");
		int rowUpdated = projectDAO.deleteProjectById(projectId);
		if (rowUpdated < 0)
			throw new DataBaseAccessException("Error occured while updating project");
		LOGGER.info("Successfully deleted the project");
	}

	@Override
	public void updateProject(ProjectModel projectModel, int projectId) throws DataBaseAccessException {
		LOGGER.info("Updating existing project");
		Project project = projectModel.getProjectDetails();
		project.setModifiedDate(LocalDate.now());
		int rowsUpdated = projectDAO.updateProject(project, projectId);
		if (rowsUpdated < 0)
			throw new DataBaseAccessException("Error occured while updating project");
		LOGGER.info("Successfully updated the Project with Project Name:{}", project.getProjectName());
	}

	@Override
	public List<Location> getAllLocations() throws DataBaseAccessException {
		LOGGER.info("fetching all Location");
		List<Location> locations = locationDAO.getAllLocation();
		if (Objects.isNull(locations))
			throw new DataBaseAccessException("Error occured while fetching the locations");
		LOGGER.info("Successfully fetched All Locations");

		return locations;
	}

	@Override
	public void saveLocation(Location location) throws DataBaseAccessException {
		LOGGER.info("saving location in database with location name:{}", location.getLocationName());
		int rowsUpdated = locationDAO.save(location);
		if (rowsUpdated < 0)
			throw new DataBaseAccessException("Error occured while saving location");
		LOGGER.info("Successfully added the location with location name:{}", location.getLocationName());
	}

	@Override
	public void deleteLocation(int locationId) throws DataBaseAccessException {
		LOGGER.info("deleting the location");
		int rowUpdated = locationDAO.deleteLocation(locationId);
		if (rowUpdated < 0)
			throw new DataBaseAccessException("Error occured while deleting the location");
		LOGGER.info("Successfully deleted the location");
	}

	@Override
	public void updateLocation(Location location, int locationId) {
		LOGGER.info("updating the location");
		int rowUpdated = locationDAO.updateLocation(location, locationId);
		if (rowUpdated < 0)
			throw new DataBaseAccessException("Error occured while updating the location");
		LOGGER.info("Successfully updated the location");
	}

	@Override
	public List<BookingDetailsOfUserForAdminAndUserReport> getAllBookingDetailsOfUserForAdminReport() {
		LOGGER.info("fetching all the booking details");
		List<BookingDetailsOfUserForAdminAndUserReport> adminAndUserReports = adminDAO
				.getAllBookingDetailsOfUserForAdminReport();
		if (Objects.isNull(adminAndUserReports))
			throw new DataBaseAccessException("Error occured while fetching the booking details of user");
		LOGGER.info("Successfully fetched the booking deatails");

		return adminAndUserReports;
	}

	@Override
	public List<Reserved> reservedSeats() throws DataBaseAccessException {
		LOGGER.info("Fetching reserved seats Details");
		List<Reserved> reserved = adminDAO.reserveSeat();
		if (Objects.isNull(reserved))
			throw new DataBaseAccessException("Error while fetching reserved seats");
		LOGGER.info("Successfully fetched reserved users");

		return reserved;
	}

	@Override
	public int reserveSeat(int userId, int floorId, int seatNumber) throws DataBaseAccessException {
		LOGGER.info("Reserving a seat in the Database");
		int reserveSeat = adminDAO.reserveSeatInDB(userId, floorId, seatNumber);
		if (reserveSeat < 0)
			throw new DataBaseAccessException("Error occured while reserving a seat");
		LOGGER.info("Successfully reserved a seat");

		return reserveSeat;
	}

	@Override
	public void restrainusers(List<Integer> userId, int floorId) throws DataBaseAccessException {
		LOGGER.info("Updating the restrainId in user");
		Restrain restrain = adminDAO.restrain(floorId);
		int restrainId = restrain.getRestrainId();
		if (Objects.isNull(userId) || userId.isEmpty()) {
			throw new DataBaseAccessException("Error while fetching userId");
		}

		for (Integer userIds : userId) {
			userDAO.getUserById(userIds);
			userDAO.setrestrainId(restrainId, userIds);
		}
	}

	@Override
	public List<Restrain> restrainedUsers() throws DataBaseAccessException {
		LOGGER.info("Fetching Restrained user details");
		List<Restrain> restrainedUsers = adminDAO.restrainedUsers();
		if (Objects.isNull(restrainedUsers))
			throw new DataBaseAccessException("Error while fetching restrained User");
		LOGGER.info("Successfully fetched restrained users");

		return restrainedUsers;
	}

	@Override
	public List<User> getApprovedUsers() throws DataBaseAccessException {
		LOGGER.info("Fetching the Approved user details");
		List<User> approvedUsers = adminDAO.findApprovedUsers();
		if (Objects.isNull(approvedUsers))
			throw new DataBaseAccessException("Error while fetching approved User");
		LOGGER.info("Successfully fetched approved users");

		return approvedUsers;
	}
}