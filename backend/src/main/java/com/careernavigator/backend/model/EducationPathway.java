package com.careernavigator.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "education_pathways")
public class EducationPathway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String careerDomain;
    private String startingStage; // AFTER_10TH, AFTER_12TH, AFTER_DIPLOMA, AFTER_UG
    private String pathwayType;   // INTER_DEGREE, POLYTECHNIC_DIPLOMA, ITI_VOCATIONAL, PROFESSIONAL, COMPETITIVE_EXAM
    private String title;
    private String duration;

    @Column(length = 600)
    private String eligibilityCriteria;

    @Column(length = 400)
    private String admissionProcess;

    private String requiredSubjects;

    private Integer approxAnnualTuitionInr;
    private Integer approxHostelLivingInr;
    private Integer approxBooksExamInr;
    private Boolean isEstimatedFee = true;

    @Column(length = 600)
    private String furtherStudyOptions;

    @Column(length = 600)
    private String employmentOpportunities;

    @Column(length = 600)
    private String pros;

    @Column(length = 600)
    private String cons;

    private String sourceReference;
    private String lastVerifiedDate;

    public EducationPathway() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCareerDomain() { return careerDomain; }
    public void setCareerDomain(String careerDomain) { this.careerDomain = careerDomain; }

    public String getStartingStage() { return startingStage; }
    public void setStartingStage(String startingStage) { this.startingStage = startingStage; }

    public String getPathwayType() { return pathwayType; }
    public void setPathwayType(String pathwayType) { this.pathwayType = pathwayType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public String getAdmissionProcess() { return admissionProcess; }
    public void setAdmissionProcess(String admissionProcess) { this.admissionProcess = admissionProcess; }

    public String getRequiredSubjects() { return requiredSubjects; }
    public void setRequiredSubjects(String requiredSubjects) { this.requiredSubjects = requiredSubjects; }

    public Integer getApproxAnnualTuitionInr() { return approxAnnualTuitionInr; }
    public void setApproxAnnualTuitionInr(Integer approxAnnualTuitionInr) { this.approxAnnualTuitionInr = approxAnnualTuitionInr; }

    public Integer getApproxHostelLivingInr() { return approxHostelLivingInr; }
    public void setApproxHostelLivingInr(Integer approxHostelLivingInr) { this.approxHostelLivingInr = approxHostelLivingInr; }

    public Integer getApproxBooksExamInr() { return approxBooksExamInr; }
    public void setApproxBooksExamInr(Integer approxBooksExamInr) { this.approxBooksExamInr = approxBooksExamInr; }

    public Boolean getIsEstimatedFee() { return isEstimatedFee; }
    public void setIsEstimatedFee(Boolean isEstimatedFee) { this.isEstimatedFee = isEstimatedFee; }

    public String getFurtherStudyOptions() { return furtherStudyOptions; }
    public void setFurtherStudyOptions(String furtherStudyOptions) { this.furtherStudyOptions = furtherStudyOptions; }

    public String getEmploymentOpportunities() { return employmentOpportunities; }
    public void setEmploymentOpportunities(String employmentOpportunities) { this.employmentOpportunities = employmentOpportunities; }

    public String getPros() { return pros; }
    public void setPros(String pros) { this.pros = pros; }

    public String getCons() { return cons; }
    public void setCons(String cons) { this.cons = cons; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(String lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }
}
