package com.valtech.bookmyseat.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestsModel {
	private int userID;
	private String name;
	private String emailID;
	private LocalDate regsiterdDate;
	private String approvalStatus;
}
