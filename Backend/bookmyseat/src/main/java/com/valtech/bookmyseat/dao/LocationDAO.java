package com.valtech.bookmyseat.dao;

import java.util.List;

import com.valtech.bookmyseat.entity.Location;
import com.valtech.bookmyseat.exception.DataBaseAccessException;

/**
 * The LocationDAO interface represents data access operations for locations.
 * Implementations of this interface are responsible for saving location data to
 * a database.
 */
public interface LocationDAO {

	/**
	 * Saves the location data into the database.
	 *
	 * @param location The Location object to be saved. It should contain all
	 *                 necessary information such as latitude, longitude, address
	 *                 details, etc.
	 * @return An integer representing the status of the save operation. Typically,
	 *         this value could indicate success or failure, or it could represent
	 *         an identifier for the newly saved location.
	 * @throws DataBaseAccessException If there is an error while saving the
	 *                                 location data into the database, this
	 *                                 exception will be thrown. This could occur
	 *                                 due to various reasons such as database
	 *                                 connectivity issues, constraint violations,
	 *                                 etc.
	 */
	int save(Location location) throws DataBaseAccessException;

	/**
	 * 
	 * Lists the location present in the database
	 * 
	 * @return A list of Location objects representing all locations.
	 *
	 * @throws DataBaseAccessException If a database access error occurs.
	 */
	List<Location> getAllLocation() throws DataBaseAccessException;

	/**
	 * Deletes a location from the system based on the provided location ID.
	 *
	 * @param locationId The unique identifier of the location to be deleted.
	 * @return An integer indicating the status of the deletion operation.
	 *         Typically, this value could represent the number of locations deleted
	 *         (which may be 1 for success and 0 for failure), or it could indicate
	 *         success or failure using specific codes.
	 * @throws DataBaseAccessException If there is an error accessing the database
	 *                                 while attempting to delete the location, this
	 *                                 exception will be thrown. This exception
	 *                                 typically encapsulates any underlying
	 *                                 database errors and provides additional
	 *                                 context or details about the failure.
	 */
	int deleteLocation(int locationId) throws DataBaseAccessException;

	/**
	 * Updates the location information in the system for a specific location ID.
	 *
	 * @param location   The updated location object containing the new information.
	 *                   This should include all fields necessary to update the
	 *                   location.
	 * @param locationId The ID of the location to be updated.
	 * @return An integer representing the status of the update operation.
	 *         Typically, this value could indicate the number of rows affected by
	 *         the update, or it could represent a success/failure indicator.
	 * @throws DataBaseAccessException If there is an error accessing the database
	 *                                 or executing the update operation, this
	 *                                 exception will be thrown. It indicates a
	 *                                 failure to update the location.
	 */
	int updateLocation(Location location, int locationId) throws DataBaseAccessException;
}