package com.valtech.bookmyseat.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.valtech.bookmyseat.model.AdminDashBoardModel;

@ExtendWith(MockitoExtension.class)
class AdminDashBoardMapperTest {

	@Mock
	private ResultSet resultSet;

	@InjectMocks
	private AdminDashBoardMapper adminDashBoardMapper;

	@Test
	void testMapRow() throws SQLException {
		when(resultSet.getInt("seats_booked")).thenReturn(5);
		when(resultSet.getInt("total_lunch_booked")).thenReturn(10);
		when(resultSet.getInt("total_tea_booked")).thenReturn(15);
		when(resultSet.getInt("total_coffee_booked")).thenReturn(20);
		when(resultSet.getInt("total_parking_booked")).thenReturn(25);
		when(resultSet.getInt("total_two_wheeler_parking_booked")).thenReturn(30);
		when(resultSet.getInt("total_four_wheeler_parking_booked")).thenReturn(35);
		when(resultSet.getInt("total_desktop_booked")).thenReturn(40);
		AdminDashBoardModel adminDashBoardModel = adminDashBoardMapper.mapRow(resultSet, 1);
		assertEquals(LocalDate.now(), adminDashBoardModel.getDate());
		assertEquals(5, adminDashBoardModel.getSeatsBooked());
		assertEquals(10, adminDashBoardModel.getTotalLunchBooked());
		assertEquals(15, adminDashBoardModel.getTotalTeaBooked());
		assertEquals(20, adminDashBoardModel.getTotalCoffeeBooked());
		assertEquals(25, adminDashBoardModel.getTotalParkingBooked());
		assertEquals(30, adminDashBoardModel.getTotalTwoWheelerParkingBooked());
		assertEquals(35, adminDashBoardModel.getTotalFourWheelerParkingBooked());
		assertEquals(40, adminDashBoardModel.getTotalDesktopBooked());
	}
}
