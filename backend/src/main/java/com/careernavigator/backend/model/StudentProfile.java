package com.careernavigator.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    @JsonIgnore
    private Student student;

    @Min(value = 13, message = "Age must be at least 13")
    @Max(value = 60, message = "Age must be 60 or below")
    private Integer age;

    private String currentQualification;
    private String boardOrUniversity;
    private String academicScore;
    private String stream;

    @Column(length = 500)
    private String preferredSubjects;

    @Column(length = 1000)
    private String interestsAndPassions;

    @Column(length = 500)
    private String preferredDomains;

    private String careerGoalType;
    private String homeState;
    private String preferredCity;

    @Min(value = 0, message = "Annual budget cannot be negative")
    private Integer annualBudgetInr;

    private Boolean willingToRelocate = true;
    private String learningMode;
    private String socialCategory;

    @Column(length = 1000)
    private String additionalNotes;

    public StudentProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getCurrentQualification() { return currentQualification; }
    public void setCurrentQualification(String currentQualification) { this.currentQualification = currentQualification; }

    public String getBoardOrUniversity() { return boardOrUniversity; }
    public void setBoardOrUniversity(String boardOrUniversity) { this.boardOrUniversity = boardOrUniversity; }

    public String getAcademicScore() { return academicScore; }
    public void setAcademicScore(String academicScore) { this.academicScore = academicScore; }

    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }

    public String getPreferredSubjects() { return preferredSubjects; }
    public void setPreferredSubjects(String preferredSubjects) { this.preferredSubjects = preferredSubjects; }

    public String getInterestsAndPassions() { return interestsAndPassions; }
    public void setInterestsAndPassions(String interestsAndPassions) { this.interestsAndPassions = interestsAndPassions; }

    public String getPreferredDomains() { return preferredDomains; }
    public void setPreferredDomains(String preferredDomains) { this.preferredDomains = preferredDomains; }

    public String getCareerGoalType() { return careerGoalType; }
    public void setCareerGoalType(String careerGoalType) { this.careerGoalType = careerGoalType; }

    public String getHomeState() { return homeState; }
    public void setHomeState(String homeState) { this.homeState = homeState; }

    public String getPreferredCity() { return preferredCity; }
    public void setPreferredCity(String preferredCity) { this.preferredCity = preferredCity; }

    public Integer getAnnualBudgetInr() { return annualBudgetInr; }
    public void setAnnualBudgetInr(Integer annualBudgetInr) { this.annualBudgetInr = annualBudgetInr; }

    public Boolean getWillingToRelocate() { return willingToRelocate; }
    public void setWillingToRelocate(Boolean willingToRelocate) { this.willingToRelocate = willingToRelocate; }

    public String getLearningMode() { return learningMode; }
    public void setLearningMode(String learningMode) { this.learningMode = learningMode; }

    public String getSocialCategory() { return socialCategory; }
    public void setSocialCategory(String socialCategory) { this.socialCategory = socialCategory; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
}
