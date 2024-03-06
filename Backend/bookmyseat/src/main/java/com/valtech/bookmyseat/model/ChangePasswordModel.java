package com.valtech.bookmyseat.model;

import lombok.Getter;

@Getter
public class ChangePasswordModel {
	private String emailId;
	private String currentPassword;
	private String newPassword;
}