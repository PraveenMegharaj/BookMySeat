package com.valtech.bookmyseat.dao;

import java.time.LocalDate;
import java.util.List;

import com.valtech.bookmyseat.entity.Booking;
import com.valtech.bookmyseat.entity.BookingMapping;
import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.entity.Shift;
import com.valtech.bookmyseat.entity.User;
import com.valtech.bookmyseat.exception.DataBaseAccessException;
import com.valtech.bookmyseat.exception.SeatAlreadyBookedException;
import com.valtech.bookmyseat.model.BookedSeatModel;
import com.valtech.bookmyseat.model.BookingModel;
import com.valtech.bookmyseat.model.RestrainReserveOfUsersModel;

/**
 * Data Access Object (DAO) interface for booking-related operations.
 */
public interface BookingDAO {

	/**
	 * Gives list of booking based on project, so that employee can book seat next
	 * to his co-worker.
	 *
	 * @param floorId   floor id which user selected to book seat
	 * @param projectId project id under which user is working
	 * @return list of bookings
	 */
	List<Booking> userPreferredSeats(int floorId, int projectId);

	/**
	 * Creates a new booking with the provided details.
	 *
	 * @param booking The booking model containing booking details such as
	 *                additional desktop, end date, lunch, parking, etc.
	 * @param user    The user for whom the booking is being made.
	 * @param seat    The seat for which the booking is being made.
	 * @param shift   The shift during which the booking will take place.
	 * @return True if the booking was successfully created, false otherwise.
	 * @throws DataBaseAccessException If any error occurs during the booking
	 *                                 creation process.
	 */
	int createBooking(BookingModel booking, User user, Seat seat, Shift shift)
			throws DataBaseAccessException, SeatAlreadyBookedException;

	/**
	 * Retrieves all booking details for a given user.
	 *
	 * @param userId The ID of the user for whom booking details are to be
	 *               retrieved.
	 * @return A list of all booking details associated with the given user.
	 */
	List<BookingMapping> getAllBookingDetails();

	/**
	 * Approves the attendance for a specific user.
	 *
	 * @param userId The ID of the user whose attendance is to be approved.
	 */
	void approvalAttendance(int userId);

	/**
	 * Checks if the user with the specified userId has already booked a slot within
	 * the given date range.
	 *
	 * @param userId    the ID of the user
	 * @param startDate the start date of the date range to check
	 * @param endDate   the end date of the date range to check
	 * @return true if the user has already booked a slot within the date range,
	 *         false otherwise
	 * @throws DataBaseAccessException if there is an error accessing the database
	 */
	boolean hasAlreadyBookedForDate(int userId, LocalDate startDate, LocalDate endDate) throws DataBaseAccessException;

	/**
	 * Creates a booking mapping for the provided booking with the specified
	 * bookingId.
	 *
	 * @param booking   the booking model containing booking details
	 * @param bookingId the ID of the booking
	 */
	void createBookingMapping(BookingModel booking, int bookingId);

	/**
	 * Retrieves all booked seats within the specified date range.
	 *
	 * @param startDate the start date of the date range (inclusive)
	 * @param endDate   the end date of the date range (inclusive)
	 * @return a list of {@link BookedSeatModel} objects representing the booked
	 *         seats within the specified date range
	 * @throws DataBaseAccessException if there is an issue accessing the database
	 */
	List<BookedSeatModel> getAllBookedSeat(LocalDate startDate, LocalDate endDate) throws DataBaseAccessException;

	List<RestrainReserveOfUsersModel> getReservedRestrainDetailsOfUsers() throws DataBaseAccessException;
}