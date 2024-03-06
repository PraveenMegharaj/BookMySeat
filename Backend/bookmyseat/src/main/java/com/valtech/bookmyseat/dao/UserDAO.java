package com.valtech.bookmyseat.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Otp;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.model.BookingDetailsOfUserForAdminAndUserReport;
import com.valtech.bookmyseat.model.UserModel;
import com.valtech.bookmyseat.model.UserModifyCancelSeat;

/**
 * Data Access Object (DAO) interface for user-related operations.
 */
public interface UserDAO {

	/**
	 * Retrieves a user by their email address.
	 *
	 * @param emailId The email address of the user to retrieve.
	 * @return The User object associated with the provided email address.
	 */
	User getUserByEmail(String emailId);

	/**
	 * Registers a new user in the system.
	 *
	 * @param user The user object to be registered.
	 * @return The registered User object.
	 */
	User userRegistration(User user);

	/**
	 * Finds a user by their user ID.
	 *
	 * @param userId The ID of the user to find.
	 * @return The User object associated with the provided user ID.
	 */
	User findUserByuserId(int userId);

	/**
	 * Creates a new user in the system based on the provided user model.
	 *
	 * @param userModel The UserModel object representing the user to be created.
	 * @return A string indicating the success or failure of the operation.
	 */
	String createUser(UserModel userModel);

	/**
	 * Checks if an employee ID exists in the system.
	 *
	 * @param userId The ID of the user to check.
	 * @return True if the employee ID exists, otherwise false.
	 */
	boolean isEmployeeIdExists(int userId);

	/**
	 * Checks if an email address exists in the system.
	 *
	 * @param emailId The email address to check.
	 * @return True if the email exists, otherwise false.
	 */
	boolean isEmailExists(String emailId);

	/**
	 * Updates an existing user in the system based on the provided user model.
	 *
	 * @param userModel The UserModel object representing the updated user
	 *                  information.
	 */
	void updateUser(UserModel userModel);

	/**
	 * Retrieves a user by their ID from the system.
	 *
	 * @param userId The ID of the user to retrieve.
	 * @return The User object representing the user with the specified ID, or null
	 *         if not found.
	 */
	User getUserById(int userId);

	/**
	 * Retrieves information about user seats.
	 *
	 * @return A list containing maps, where each map represents information about a
	 *         user seat. The maps have String keys representing the attributes of
	 *         the seat (e.g., seat number, user ID), and Object values representing
	 *         the corresponding data.
	 */
	List<Map<String, Object>> getUserSeatInfo();

	/**
	 * Retrieves details for all users, optionally filtering by a specific user ID.
	 *
	 * @param userId (Optional) The ID of the user to retrieve details for. If
	 *               provided, details will be retrieved only for this user. If set
	 *               to 0 or null, details for all users will be retrieved.
	 * @return A list of User objects containing details for the users that match
	 *         the provided user ID (if any). If no user ID is provided or if no
	 *         users match the provided ID, details for all users will be returned.
	 * @throws SomeException (Optional) Throws an exception if there is an error
	 *                       retrieving user details.
	 */
	List<User> getAllUserDetails(int userId);

	/**
	 * Retrieves the seat ID based on the seat number and floor ID.
	 *
	 * @param seatNumber The seat number to search for.
	 * @param floorId    The ID of the floor where the seat is located.
	 * @return The ID of the seat matching the provided seat number and floor ID, or
	 *         null if not found.
	 */
	Integer getSeatIdByNumberAndFloor(int seatNumber, int floorId);

	/**
	 * Updates the user seat based on the provided seat ID and booking ID.
	 *
	 * @param seatId    The ID of the seat to update.
	 * @param bookingId The ID of the booking associated with the user's seat.
	 * @return number of row updated
	 */
	int updateUserSeat(int seatId, int bookingId);

	/**
	 * Cancels the user booking associated with the provided booking ID.
	 *
	 * @param bookingId The ID of the booking to cancel.
	 */
	int cancelUserSeat(int bookingId);

	/**
	 * Retrieves the booking details for a particular user to display on their
	 * dashboard.
	 * 
	 * @param userId The ID of the user whose booking details are being retrieved.
	 * @return A list of Booking Mapping objects containing details about the
	 *         bookings made by the user.
	 */
	List<BookingMapping> getUserDashboardDetails(int userId);

	/**
	 * Retrieves the user with the specified user ID.
	 * 
	 * @param userId The ID of the user to retrieve.
	 * @return The user object corresponding to the provided user ID, or null if no
	 *         user is found.
	 */
	User getById(int userId);

	/**
	 * Retrieves the booking details of a user for a given user ID and seat ID.
	 *
	 * @param userId The ID of the user.
	 * @param seatId The ID of the seat.
	 * @return A list of UserModifyBooking objects containing the booking details
	 *         for the user and seat.
	 */
	List<UserModifyCancelSeat> getBookingDeatilsOfUser(int userId, int seatId);

	/**
	 * Retrieves the user ID associated with a given booking ID.
	 *
	 * @param bookingId The ID of the booking.
	 * @return The user ID associated with the booking.
	 */
	Integer getUserIdByBookingId(int bookingId);

	/**
	 * Retrieves a list of booking histories for a particular user based on their
	 * userId.
	 *
	 * @param userId the unique identifier of the user whose booking histories are
	 *               to be retrieved
	 * @return a list of UserBookingHistory objects representing the booking
	 *         histories of the user
	 * @throws DataBaseAccessException if there is an error accessing the database
	 */
	List<BookingDetailsOfUserForAdminAndUserReport> getBookingHistoryByUserId(int userId)
			throws DataBaseAccessException;

	/**
	 * Updates the password for the user with the specified user ID. This method
	 * sets the user's password to the provided password.
	 *
	 * @param userId   the ID of the user whose password is to be updated
	 * @param password the new password to set for the user
	 * @throws DataAccessException if an error occurs while updating the password in
	 *                             the data access layer
	 */
	void updateUserPassword(int userId, String password) throws DataAccessException;

	/**
	 * Retrieves the latest creation time of OTP (One-Time Password) associated with
	 * the provided user ID.
	 * 
	 * @param userId The ID of the user for whom the latest OTP creation time is
	 *               retrieved.
	 * @return A LocalDateTime object representing the latest OTP creation time.
	 */
	LocalDateTime getLatestOtpCreationTimeByUserId(int userId);

	/**
	 * Retrieves the latest OTP value associated with the provided user ID.
	 * 
	 * @param userId The ID of the user for whom the latest OTP value is retrieved.
	 * @return A String representing the latest OTP value.
	 */
	String getLatestOtpByUserId(int userId);

	/**
	 * Saves the provided OTP object into the data store.
	 * 
	 * @param otp The OTP object to be saved.
	 */
	void saveOtp(Otp otp);

	/**
	 * Retrieves the number of rows affected by the last database operation.
	 * 
	 * @return An integer representing the number of rows affected.
	 */
	int getRowsAffected();

	/**
	 * Updates the password for the user who forgets their password.
	 *
	 * @param userId      The ID of the user whose password is to be updated.
	 * @param newPassword The new password to be set for the user.
	 */
	void updateUseForgetPassword(int userId, String newPassword);

	/**
	 * Retrieves the seat ID associated with the given booking ID.
	 *
	 * @param bookingId The ID of the booking for which to retrieve the seat ID.
	 * @return The seat ID associated with the given booking ID.
	 * @throws DataBaseAccessException If an error occurs while accessing the
	 *                                 database.
	 */
	int getSeatIdByBookingId(int bookingId) throws DataBaseAccessException;

	/**
	 * Sets the restrain ID for the specified user.
	 *
	 * @param restrainId The ID of the restrain to set for the user.
	 * @param userId     The ID of the user for whom to set the restrain ID.
	 * @return The number of rows affected by the update operation.
	 * @throws DataBaseAccessException If an error occurs while accessing the
	 *                                 database.
	 */
	int setrestrainId(int restrainId, int userId);

}