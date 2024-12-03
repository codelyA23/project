-- Create Database
CREATE DATABASE StudentRegistration;
USE StudentRegistration;

-- Preliminary Information Table
CREATE TABLE PreliminaryInformation (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Course VARCHAR(255) NOT NULL,
    Semester ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    IntakeMonth VARCHAR(50) NOT NULL,
    Source ENUM('Advertisement', 'Open Day', 'Walk-in', 'Education Fair', 'Friend', 'Telemarketing', 'Others') NOT NULL,
    StudentNumber VARCHAR(50)
);

-- Personal Information Table
CREATE TABLE PersonalInformation (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    ICPassportNo VARCHAR(255) NOT NULL,
    PlaceOfBirth VARCHAR(255),
    Race VARCHAR(255),
    Religion VARCHAR(255),
    DateOfBirth DATE NOT NULL,
    MaritalStatus ENUM('Single', 'Married', 'Widow/Widower', 'Divorced'),
    Gender ENUM('Male', 'Female') NOT NULL,
    Age INT,
    Nationality VARCHAR(255) NOT NULL,
    CurrentAddress TEXT NOT NULL,
    TelephoneNo VARCHAR(20),
    Email VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- Parent Information Table
CREATE TABLE ParentInformation (
    StudentID INT PRIMARY KEY,
    FathersName VARCHAR(255),
    MothersName VARCHAR(255),
    TelephoneNo VARCHAR(20),
    Email VARCHAR(255),
    CompanyDetails TEXT,
    Occupation VARCHAR(255),
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- Academic Information Table
CREATE TABLE AcademicQualifications (
    QualificationID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    DateOfExamination DATE,
    NameOfExamination VARCHAR(255),
    NameOfSchool VARCHAR(255),
    Result VARCHAR(255),
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- English Language Qualifications Table
CREATE TABLE EnglishQualifications (
    QualificationID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    DateOfExamination DATE,
    NameOfExamination VARCHAR(255),
    NameOfSchool VARCHAR(255),
    Result VARCHAR(255),
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- Medical Details Table
CREATE TABLE MedicalDetails (
    StudentID INT PRIMARY KEY,
    Disability ENUM('Yes', 'No') NOT NULL,
    Details TEXT,
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- Emergency Contact Details Table
CREATE TABLE EmergencyContactDetails (
    ContactID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    PersonName VARCHAR(255) NOT NULL,
    Occupation VARCHAR(255),
    Relationship VARCHAR(255) NOT NULL,
    MobileNo VARCHAR(20) NOT NULL,
    Email VARCHAR(255),
    OfficeTelNo VARCHAR(20),
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

-- For Office Use Only Table
CREATE TABLE OfficeUse (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    ApplicationStatus ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
    ProcessedBy VARCHAR(255),
    Date DATE,
    Remarks TEXT,
    FOREIGN KEY (StudentID) REFERENCES PreliminaryInformation(StudentID)
);

DELIMITER $$
CREATE PROCEDURE GetStudentData(IN student_id INT)
BEGIN
    SELECT * FROM PreliminaryInformation WHERE StudentID = student_id;
    SELECT * FROM PersonalInformation WHERE StudentID = student_id;
    SELECT * FROM ParentInformation WHERE StudentID = student_id;
    SELECT * FROM AcademicQualifications WHERE StudentID = student_id;
    SELECT * FROM EnglishQualifications WHERE StudentID = student_id;
    SELECT * FROM MedicalDetails WHERE StudentID = student_id;
    SELECT * FROM EmergencyContactDetails WHERE StudentID = student_id;
    SELECT * FROM OfficeUse WHERE StudentID = student_id;
END$$
DELIMITER ;

DELIMITER $$

CREATE TRIGGER UpdateApplicationStatus
AFTER UPDATE ON OfficeUse
FOR EACH ROW
BEGIN
    IF NEW.Remarks IS NOT NULL THEN
        UPDATE OfficeUse 
        SET ApplicationStatus = 'Pending' 
        WHERE ApplicationID = NEW.ApplicationID;
    END IF;
END$$

DELIMITER ;

CREATE VIEW StudentContactView AS
SELECT pi.StudentID, pi.Name, pi.Email, pi.TelephoneNo, ec.PersonName AS EmergencyContact, ec.MobileNo AS EmergencyContactNo
FROM PersonalInformation pi
JOIN EmergencyContactDetails ec ON pi.StudentID = ec.StudentID;

CREATE INDEX idx_student_name ON PersonalInformation(Name);




