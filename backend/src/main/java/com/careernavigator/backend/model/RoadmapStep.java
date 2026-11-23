package com.careernavigator.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_steps")
public class RoadmapStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;

    private String targetCareer;
    private Integer stepOrder;
    private String phaseTitle;

    @Column(length = 800)
    private String description;

    private String estimatedDuration;
    private String freeResourceTitle;
    private String freeResourceUrl;
    private String practicalProject;
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    public RoadmapStep() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getTargetCareer() { return targetCareer; }
    public void setTargetCareer(String targetCareer) { this.targetCareer = targetCareer; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }

    public String getPhaseTitle() { return phaseTitle; }
    public void setPhaseTitle(String phaseTitle) { this.phaseTitle = phaseTitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getFreeResourceTitle() { return freeResourceTitle; }
    public void setFreeResourceTitle(String freeResourceTitle) { this.freeResourceTitle = freeResourceTitle; }

    public String getFreeResourceUrl() { return freeResourceUrl; }
    public void setFreeResourceUrl(String freeResourceUrl) { this.freeResourceUrl = freeResourceUrl; }

    public String getPracticalProject() { return practicalProject; }
    public void setPracticalProject(String practicalProject) { this.practicalProject = practicalProject; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
