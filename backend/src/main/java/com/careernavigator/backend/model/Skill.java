package com.careernavigator.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Skill name is required")
    @Size(min = 2, max = 60, message = "Skill name must be between 2 and 60 characters")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Skill category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

    public Skill() {
    }

    public Skill(String name, String category) {
        this.name = name;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
