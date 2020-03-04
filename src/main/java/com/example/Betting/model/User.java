package com.example.Betting.model;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name="user")
public class User {

	@Id
	private long id;

	private String name;
	
	private String location;
	
	private int age;

	private float money;

	@OneToMany(mappedBy = "user")
	private Set<Transaction> transaction;
}