package com.valtech.bookmyseat.dao;

import java.util.List;

import com.valtech.bookmyseat.entity.Floor;

/**
 * Data Access Object (DAO) interface for floor-related operations.
 */
public interface FloorDAO {

	/**
	 * Retrieves a list of all floors from the data source.
	 *
	 * @return a list containing all floor objects available in the data source
	 */
	List<Floor> getAllFloors();

	/**
	 * Retrieves a floor from the data source based on its unique identifier.
	 *
	 * @param floorId the unique identifier of the floor to retrieve
	 * @return the floor object corresponding to the given identifier, or null if no
	 *         floor with the specified ID is found
	 */
	Floor getFloorById(int floorId);
}