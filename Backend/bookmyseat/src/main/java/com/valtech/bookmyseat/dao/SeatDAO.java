package com.valtech.bookmyseat.dao;

import java.time.LocalDate;
import java.util.List;

import com.valtech.bookmyseat.entity.Seat;
import com.valtech.bookmyseat.exception.DataBaseAccessException;

/**
 * This interface provides methods for accessing seat data in the database.
 */
public interface SeatDAO {

	/**
	 * Retrieves the list of available seats on a specific floor within the
	 * specified date range.
	 * 
	 * @param floorId   The ID of the floor where the seats are located.
	 * @param startDate The start date of the date range to check seat availability.
	 * @param endDate   The end date of the date range to check seat availability.
	 * @return A list of available Seat objects on the specified floor within the
	 *         given date range.
	 */
	List<Seat> findAvailableSeatsByFloorOnDate(int floorId, LocalDate startDate, LocalDate endDate);

	/**
	 * Retrieves the Seat object associated with the provided seat ID.
	 *
	 * @param seatId The ID of the seat for which the Seat object is retrieved.
	 * @return The Seat object corresponding to the provided seat ID, or null if no
	 *         such seat is found.
	 */
	Seat findSeatById(int seatNumber, int floorId);

	/**
	 * Finds the Seat ID corresponding to the given seat number and floor ID.
	 *
	 * @param seatNumber The seat number to search for.
	 * @param floorId    The ID of the floor where the seat is located.
	 * @return The Seat ID associated with the provided seat number and floor ID.
	 * @throws DataBaseAccessException If there is an issue accessing the database.
	 */
	int findSeatId(int seatNumber, int floorId) throws DataBaseAccessException;
}