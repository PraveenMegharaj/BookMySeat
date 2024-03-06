package com.valtech.bookmyseat.service;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.model.BookedSeatModel;
import com.valtech.bookmyseat.model.BookingModel;
import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;

/**
 * This interface provides methods for managing bookings.
 */
public interface BookingService {

	/**
	 * Retrieves the list of preferred seats for a user on a specific floor and
	 * project.
	 * 
	 * @param floorId   The ID of the floor where the seats are located.
	 * @param projectId The ID of the project associated with the seats.
	 * @return A list of Booking objects representing the preferred seats.
	 */
	List<Booking> getUserPreferredSeats(int floorId, int projectId);

	/**
	 * Retrieves all booking details associated with a specific user.
	 *
	 * @param userId The ID of the user for whom booking details are to be
	 *               retrieved.
	 * @return A list containing all booking details for the specified user.
	 */
	List<BookingMapping> getAllBookingDetails();

	/**
	 * Approves the attendance record for a specific user.
	 *
	 * @param userId The ID of the user whose attendance record is being approved.
	 */
	void approveUserAttendance(int userId);

	/**
	 * Creates a new booking with the provided details.
	 *
	 * @param booking The booking model containing booking details such as
	 *                additional desktop, end date, lunch, parking, etc.
	 * @param user    The user for whom the booking is being made.
	 * @throws DataBaseAccessException If an error occurs while accessing the
	 *                                 database.
	 * @throws SQLException
	 */
	int createBooking(BookingModel booking, User user) throws DataBaseAccessException, SQLException;

	/**
	 * Creates a booking mapping for the specified booking model and booking ID.
	 *
	 * @param booking   The booking model containing the details of the booking to
	 *                  be mapped.
	 * @param bookingId The ID of the booking to which the mapping will be created.
	 * @throws DataBaseAccessException If an error occurs while accessing the
	 *                                 database.
	 */
	void createBookingMapping(BookingModel booking, int bookingId) throws DataBaseAccessException;

	/**
	 * Retrieves all booked seats within the specified date range.
	 *
	 * @param startDate the start date of the date range (inclusive)
	 * @param endDate   the end date of the date range (inclusive)
	 * @return a list of {@code BookedSeatModel} objects representing the booked
	 *         seats within the specified date range
	 * @throws DataBaseAccessException if there is an issue accessing the database
	 */
	List<BookedSeatModel> getAllBookedSeat(LocalDate startDate, LocalDate endDate) throws DataBaseAccessException;

	/**
	 * Checks if the given date is a holiday.
	 *
	 * @param date The date to check.
	 * @return {@code true} if the date is a holiday, {@code false} otherwise.
	 */
	boolean isHolidayforDate(LocalDate date);

	/**
	 * Checks if the specified user has already booked seats for any dates within
	 * the given date range.
	 *
	 * @param userId    The ID of the user to check.
	 * @param startDate The start date of the date range.
	 * @param endDate   The end date of the date range.
	 * @return {@code true} if the user has already booked seats for any dates
	 *         within the date range, {@code false} otherwise.
	 */
	boolean hasAlreadyBookedForDateCheck(int userId, LocalDate startDate, LocalDate endDate);

	List<RestrainReserveOfUsersModel> getRestrainReservedDetailsOfUsers();
}