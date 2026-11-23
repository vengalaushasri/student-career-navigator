package com.careernavigator.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "government_schemes")
public class GovernmentScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;
    private String level; // CENTRAL or STATE
    private String applicableState; // ALL or specific state e.g. Telangana
    private String targetAudience;

    @Column(length = 800)
    private String eligibilityRequirements;

    private Integer maxFamilyIncomeInr;

    @Column(length = 600)
    private String financialBenefit;

    @Column(length = 600)
    private String documentsRequired;

    @Column(length = 600)
    private String applicationProcedure;

    private String deadlineInfo;
    private String officialWebsite;
    private String status;
    private String lastVerifiedDate;

    public GovernmentScheme() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getApplicableState() { return applicableState; }
    public void setApplicableState(String applicableState) { this.applicableState = applicableState; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getEligibilityRequirements() { return eligibilityRequirements; }
    public void setEligibilityRequirements(String eligibilityRequirements) { this.eligibilityRequirements = eligibilityRequirements; }

    public Integer getMaxFamilyIncomeInr() { return maxFamilyIncomeInr; }
    public void setMaxFamilyIncomeInr(Integer maxFamilyIncomeInr) { this.maxFamilyIncomeInr = maxFamilyIncomeInr; }

    public String getFinancialBenefit() { return financialBenefit; }
    public void setFinancialBenefit(String financialBenefit) { this.financialBenefit = financialBenefit; }

    public String getDocumentsRequired() { return documentsRequired; }
    public void setDocumentsRequired(String documentsRequired) { this.documentsRequired = documentsRequired; }

    public String getApplicationProcedure() { return applicationProcedure; }
    public void setApplicationProcedure(String applicationProcedure) { this.applicationProcedure = applicationProcedure; }

    public String getDeadlineInfo() { return deadlineInfo; }
    public void setDeadlineInfo(String deadlineInfo) { this.deadlineInfo = deadlineInfo; }

    public String getOfficialWebsite() { return officialWebsite; }
    public void setOfficialWebsite(String officialWebsite) { this.officialWebsite = officialWebsite; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(String lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }
}
