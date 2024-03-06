package com.valtech.bookmyseat.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valtech.bookmyseat.entity.Holiday;
import com.valtech.bookmyseat.entity.Location;
import com.valtech.bookmyseat.entity.Project;
import com.valtech.bookmyseat.entity.Reserved;
import com.valtech.bookmyseat.entity.Restrain;
import com.valtech.bookmyseat.entity.Shift;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.exception.DuplicateEmailException;
import com.valtech.bookmyseat.exception.EmailException;
import com.valtech.bookmyseat.model.AdminDashBoardModel;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.ProjectModel;
import com.valtech.bookmyseat.model.RestrainRequestBody;
import com.valtech.bookmyseat.model.UserModel;
import com.valtech.bookmyseat.model.UserRequestsModel;
import com.valtech.bookmyseat.service.AdminService;
import com.valtech.bookmyseat.service.HolidayService;
import com.valtech.bookmyseat.service.ShiftDetailsService;
import com.valtech.bookmyseat.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
@RequestMapping("/bookmyseat/admin")
public class AdminController {
	private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);

	@Autowired
	private AdminService adminService;

	@Autowired
	public UserService userService;

	@Autowired
	private HolidayService holidayService;

	@Autowired
	private ShiftDetailsService shiftDetailsService;

	@GetMapping("/dashboard")
	public ResponseEntity<List<AdminDashBoardModel>> getAdminDashboardDetails() throws DataBaseAccessException {
		LOGGER.info("Handling the request for Admin Dashboard");

		return ResponseEntity.status(HttpStatus.OK).body(adminService.fetchAdminDashboardDetails());
	}

	@GetMapping("/requests")
	public ResponseEntity<List<UserRequestsModel>> getUsersPendingRequests() {
		LOGGER.info("Handling the request for Pending Requests");

		return ResponseEntity.ok(adminService.fetchUserRequests());
	}

	@PutMapping("/request/update")
	public ResponseEntity<Integer> updateUserRequests(@RequestBody List<UserRequestsModel> userRequestsModels,
			@AuthenticationPrincipal UserDetails userDetails) throws EmailException {
		LOGGER.info("Handling the request for Updating Multiple Requests");
		User user = userService.findUserByEmail(userDetails.getUsername());

		return ResponseEntity.ok(adminService.updateUserRequests(userRequestsModels, user.getUserId()));
	}

	@PostMapping("/createuser")
	public ResponseEntity<String> createUser(@RequestBody UserModel userModel) throws EmailException {
		try {
			userService.createUser(userModel);

			return ResponseEntity.ok("User created successfully");
		} catch (DuplicateEmailException e) {
			LOGGER.error("handling the DuplicateEmailException:{}", e.getMessage());

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/update")
	public ResponseEntity<String> updateUserProfileByAdmin(@RequestBody UserModel userModel) {
		userService.updateUserProfileByAdmin(userModel);

		return ResponseEntity.ok("User profile updated successfully");
	}

	@GetMapping("/user-seat-info")
	public List<Map<String, Object>> getUserSeatInfo() throws DataBaseAccessException {
		LOGGER.info("handling the request for seat-info");

		return userService.getUserSeatInfo();
	}

	@PostMapping("/createProject")
	public ResponseEntity<String> saveNewProject(@RequestBody ProjectModel projectModel) {
		LOGGER.info("Handling the Create project request");
		adminService.createNewProject(projectModel);

		return ResponseEntity.ok().body("Project Added Successfully");
	}

	@GetMapping("/projects")
	public ResponseEntity<List<Project>> getAllProjects() {
		LOGGER.info("Handling the Get All Project request");

		return ResponseEntity.ok().body(adminService.getAllProjects());
	}

	@DeleteMapping("/project/{projectId}")
	public ResponseEntity<String> deleteSelectedProject(@PathVariable int projectId) {
		LOGGER.info("Handling the Delete Project request");
		adminService.deleteProjectById(projectId);

		return ResponseEntity.ok().body("Project Deleted Successfully");
	}

	@DeleteMapping("/deleteShiftDetails/{shiftId}")
	public String deleteShiftDetails(@PathVariable("shiftId") int shiftId) {
		LOGGER.info("Handling request for deleting shift");

		return shiftDetailsService.deleteShift(shiftId);
	}

	@PutMapping("/updateProject/{projectId}")
	public ResponseEntity<String> updateProject(@PathVariable int projectId, @RequestBody ProjectModel projectModel) {
		LOGGER.info("Handling the Update Project request");
		adminService.updateProject(projectModel, projectId);

		return ResponseEntity.ok().body("Project Updated Successfully");
	}

	@PostMapping("/addShiftTime")
	public String addShiftTime(@RequestBody Shift shift) {
		LOGGER.info("Handling request for adding shift");

		return shiftDetailsService.addShiftTime(shift);
	}

	@GetMapping("/getAllShiftDetails")
	public List<Shift> getAllShiftDetails() {
		LOGGER.info("Handling request to fetch allshifts");

		return shiftDetailsService.getAllShiftDetails();
	}

	@PutMapping("/updateShiftTime/{shiftId}")
	public String updateShiftTime(@PathVariable int shiftId, @RequestBody Shift shift) {
		LOGGER.info("Handling request for updating shift");

		return shiftDetailsService.updateShiftTime(shiftId, shift);
	}

	@PostMapping("/location")
	public ResponseEntity<String> saveLocation(@RequestBody Location location) {
		adminService.saveLocation(location);
		LOGGER.info("handling the request for adding the location");

		return ResponseEntity.ok().body("Location added successfully");
	}

	@GetMapping("/allLocation")
	public ResponseEntity<List<Location>> getAllLocation() {
		LOGGER.info(" Handling the Request for Get All location");

		return ResponseEntity.ok().body(adminService.getAllLocations());
	}

	@DeleteMapping("deleteLocation/{locationId}")
	public ResponseEntity<String> deleteLocation(@PathVariable int locationId) {
		LOGGER.info("Handling the Location Delete request");
		adminService.deleteLocation(locationId);

		return ResponseEntity.ok().body("Locations Deleted Successfully");
	}

	@PutMapping("updateLocation/{locationId}")
	public ResponseEntity<String> updateLocation(@PathVariable int locationId, @RequestBody Location locationModel) {
		LOGGER.info(" handling the Location Update request");
		adminService.updateLocation(locationModel, locationId);

		return ResponseEntity.ok().body("Location Updated Successfully");
	}

	@GetMapping("/reports")
	public ResponseEntity<List<BookingDetailsOfUserForAdminAndUserReport>> getAllBookingDetails() {
		LOGGER.info("handling request to fetch all booking details");

		return ResponseEntity.status(HttpStatus.OK).body(adminService.getAllBookingDetailsOfUserForAdminReport());
	}

	@GetMapping("/getAllUsers/{userId}")
	public List<User> getUserDetailsById(@PathVariable int userId) {

		return userService.getAllUser(userId);
	}

	@GetMapping("/reserve")
	public List<Reserved> reserveSeat() {
		LOGGER.info("Handling request to fetch reserved seats");

		return adminService.reservedSeats();
	}

	@PostMapping("/reserve/{userId}/{floorId}/{seatNumber}")
	public ResponseEntity<String> reserveSeats(@PathVariable("userId") int userId, @PathVariable("floorId") int floorId,
			@PathVariable("seatNumber") int seatNumber) {
		LOGGER.info("Handling request to reserve a seat");
		adminService.reserveSeat(userId, floorId, seatNumber);

		return ResponseEntity.ok().body("Seat Reserved Successfully");
	}

	@PutMapping("/updateSeat/{seatNumber}/{floorId}/{bookingId}")
	public ResponseEntity<String> updateUserSeat(@PathVariable("seatNumber") int seatNumber,
			@PathVariable("floorId") int floorId, @PathVariable("bookingId") int bookingId) throws EmailException {
		LOGGER.info("handling request to update user seat");
		userService.updateUserSeat(seatNumber, floorId, bookingId);

		return ResponseEntity.status(HttpStatus.OK).body("User seat updated successfully.");
	}

	@PutMapping("/cancelBooking/{bookingId}")
	public ResponseEntity<String> cancelBooking(@PathVariable("bookingId") int bookingId,
			@AuthenticationPrincipal UserDetails userDetails) throws EmailException {
		LOGGER.info("Seat Canceled Successfully");
		userService.cancelUserSeat(bookingId);

		return ResponseEntity.status(HttpStatus.OK).body("User Seat cancelled successfully.");
	}

	@GetMapping("/holidays")
	public ResponseEntity<List<Holiday>> getAllHolidays() {
		return ResponseEntity.ok().body(holidayService.getAllHolidays());
	}

	@PostMapping("/addHolidays")
	public String addHoliday(@RequestBody Holiday holiday) {
		LOGGER.info("Handling request for adding holiday");

		return holidayService.addHolidayByAdmin(holiday);
	}

	@DeleteMapping("/deleteholidays/{holidayId}")
	public String deleteHoildayDetails(@PathVariable("holidayId") int holidayId) {
		LOGGER.info("Handling request for deleting Holiday");

		return holidayService.deleteHoliday(holidayId);
	}

	@GetMapping("/admin/holidays")

	public ResponseEntity<List<Holiday>> getHolidayByDate() {
		LOGGER.info("Handling request for getting List of  Holiday");

		return ResponseEntity.ok().body(holidayService.getHoildayBydate());
	}

	@GetMapping("/adminProfile")
	public ResponseEntity<User> adminProfile(@AuthenticationPrincipal UserDetails userDetails) {
		User user = userService.findUserByEmail(userDetails.getUsername());

		return ResponseEntity.ok(user);
	}

	@PostMapping("/restrainusers")
	public ResponseEntity<String> restrainUsers(@RequestBody RestrainRequestBody requestBody) {
		LOGGER.info("Handling the request to update restrain");
		List<Integer> userIds = requestBody.getUserId();
		int floorId = requestBody.getFloor_id();
		adminService.restrainusers(userIds, floorId);

		return ResponseEntity.ok().body("Users restrained successfully.");
	}

	@GetMapping("/restrainedUsers")
	public List<Restrain> restrainedUsers() {
		LOGGER.info("Handling request to fetch restrain details");

		return adminService.restrainedUsers();
	}

	@GetMapping("/approved")
	public List<User> getApprovedUsers() {
		LOGGER.info("Handling request for approved user details");

		return adminService.getApprovedUsers();
	}
}
