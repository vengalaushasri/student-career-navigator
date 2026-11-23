package com.careernavigator.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "colleges")
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String district;
    private String state;
    private String address;
    private String institutionType; // GOVERNMENT, AIDED, PRIVATE
    private String coursesOffered;
    private String specializations;
    private Integer annualTuitionFeeInr;
    private Integer annualHostelFoodFeeInr;
    private Integer otherAnnualFeeInr;
    private Boolean feeIsEstimated = false;
    private String entranceExam;
    private String accreditation;
    private Boolean hostelAvailable = true;

    @Column(length = 600)
    private String placementInfo;

    private String officialWebsite;
    private String mapsUrl;
    private String contactInfo;
    private String sourceReference;
    private String lastVerifiedDate;

    public College() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getInstitutionType() { return institutionType; }
    public void setInstitutionType(String institutionType) { this.institutionType = institutionType; }

    public String getCoursesOffered() { return coursesOffered; }
    public void setCoursesOffered(String coursesOffered) { this.coursesOffered = coursesOffered; }

    public String getSpecializations() { return specializations; }
    public void setSpecializations(String specializations) { this.specializations = specializations; }

    public Integer getAnnualTuitionFeeInr() { return annualTuitionFeeInr; }
    public void setAnnualTuitionFeeInr(Integer annualTuitionFeeInr) { this.annualTuitionFeeInr = annualTuitionFeeInr; }

    public Integer getAnnualHostelFoodFeeInr() { return annualHostelFoodFeeInr; }
    public void setAnnualHostelFoodFeeInr(Integer annualHostelFoodFeeInr) { this.annualHostelFoodFeeInr = annualHostelFoodFeeInr; }

    public Integer getOtherAnnualFeeInr() { return otherAnnualFeeInr; }
    public void setOtherAnnualFeeInr(Integer otherAnnualFeeInr) { this.otherAnnualFeeInr = otherAnnualFeeInr; }

    public Boolean getFeeIsEstimated() { return feeIsEstimated; }
    public void setFeeIsEstimated(Boolean feeIsEstimated) { this.feeIsEstimated = feeIsEstimated; }

    public String getEntranceExam() { return entranceExam; }
    public void setEntranceExam(String entranceExam) { this.entranceExam = entranceExam; }

    public String getAccreditation() { return accreditation; }
    public void setAccreditation(String accreditation) { this.accreditation = accreditation; }

    public Boolean getHostelAvailable() { return hostelAvailable; }
    public void setHostelAvailable(Boolean hostelAvailable) { this.hostelAvailable = hostelAvailable; }

    public String getPlacementInfo() { return placementInfo; }
    public void setPlacementInfo(String placementInfo) { this.placementInfo = placementInfo; }

    public String getOfficialWebsite() { return officialWebsite; }
    public void setOfficialWebsite(String officialWebsite) { this.officialWebsite = officialWebsite; }

    public String getMapsUrl() { return mapsUrl; }
    public void setMapsUrl(String mapsUrl) { this.mapsUrl = mapsUrl; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public String getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(String lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }
}
