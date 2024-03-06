package com.valtech.bookmyseat.model;

import java.util.List;

import lombok.Getter;

@Getter
public class RestrainRequestBody {
	private List<Integer> userId;
	private int floor_id;
	private int restrainId;
}
