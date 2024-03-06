package com.valtech.bookmyseat.model;

import lombok.Getter;

@Getter
public class UserResetPasswordModel {
	private int userId;
	private String newPassword;
}