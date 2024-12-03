<?php
// Enhanced error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    $message = date('[Y-m-d H:i:s] ') . "Error ($errno): $errstr in $errfile on line $errline\n";
    file_put_contents('error.log', $message, FILE_APPEND);
    return true;
});

// Set exception handler
set_exception_handler(function($e) {
    $message = date('[Y-m-d H:i:s] ') . "Uncaught Exception: " . $e->getMessage() . 
               " in " . $e->getFile() . " on line " . $e->getLine() . "\n";
    file_put_contents('error.log', $message, FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Server error occurred"]);
    exit;
});

// Log request headers
$headers = getallheaders();
file_put_contents('debug.log', "Request Headers: " . print_r($headers, true) . "\n", FILE_APPEND);

// Verify content type
if (!isset($headers['Content-Type']) || $headers['Content-Type'] !== 'application/json') {
    file_put_contents('debug.log', "Invalid Content-Type: " . ($headers['Content-Type'] ?? 'not set') . "\n", FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid Content-Type"]);
    exit;
}

// Log raw input data
$rawInput = file_get_contents('php://input');
file_put_contents('debug.log', "Raw Input: $rawInput\n", FILE_APPEND);

// Attempt to decode JSON
$data = json_decode($rawInput, true);

// Log any JSON decoding errors
if (!$data) {
    file_put_contents('debug.log', "JSON Decode Error: " . json_last_error_msg() . "\n", FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Invalid form data"]);
    exit;
}

// Set response headers
header('Content-Type: application/json');

// Database connection configuration
$servername = "localhost";
$username = "root";
$password = "A23o38567";
$dbname = "StudentRegistration";

// Wrap database operations in try-catch
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Start transaction
    $conn->begin_transaction();

    // 1. Insert Preliminary Information
    $stmt = $conn->prepare("INSERT INTO PreliminaryInformation (Course, Semester, IntakeMonth, Source) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    $stmt->bind_param("ssss", 
        $data['course'],
        $data['semester'],
        $data['intake'],
        $data['referralSource']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $studentId = $stmt->insert_id;
    $stmt->close();

    // 2. Insert Personal Information
    $stmt = $conn->prepare("INSERT INTO PersonalInformation (StudentID, Name, ICPassportNo, PlaceOfBirth, Race, Religion, DateOfBirth, MaritalStatus, Gender, Age, Nationality, CurrentAddress, TelephoneNo, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("issssssssissss",
        $studentId,
        $data['fullName'],
        $data['icPassport'],
        $data['placeOfBirth'],
        $data['race'],
        $data['religion'],
        $data['dateOfBirth'],
        $data['maritalStatus'],
        $data['gender'],
        $data['age'],
        $data['nationality'],
        $data['currentAddress'],
        $data['phoneNumber'],
        $data['email']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Personal Information insert failed: " . $stmt->error);
    }
    $stmt->close();

    // 3. Insert Parent Information
    $stmt = $conn->prepare("INSERT INTO ParentInformation (StudentID, FathersName, MothersName, TelephoneNo, Email, CompanyDetails, Occupation) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("issssss",
        $studentId,
        $data['fatherName'],
        $data['motherName'],
        $data['parentPhone'],
        $data['parentEmail'],
        $data['companyAddress'],
        $data['parentOccupation']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Parent Information insert failed: " . $stmt->error);
    }
    $stmt->close();

    // 4. Insert Academic Qualifications
    $stmt = $conn->prepare("INSERT INTO AcademicQualifications (StudentID, DateOfExamination, NameOfExamination, NameOfSchool, Result) VALUES (?, ?, ?, ?, ?)");
    
    foreach (['1', '2'] as $index) {
        if (!empty($data["exam_date_$index"])) {
            $stmt->bind_param("issss",
                $studentId,
                $data["exam_date_$index"],
                $data["exam_name_$index"],
                $data["school_name_$index"],
                $data["result_$index"]
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Academic Qualification insert failed: " . $stmt->error);
            }
        }
    }
    $stmt->close();

    // 5. Insert English Qualifications
    $stmt = $conn->prepare("INSERT INTO EnglishQualifications (StudentID, DateOfExamination, NameOfExamination, NameOfSchool, Result) VALUES (?, ?, ?, ?, ?)");
    
    if (!empty($data['eng_exam_date_1'])) {
        $stmt->bind_param("issss",
            $studentId,
            $data['eng_exam_date_1'],
            $data['eng_exam_name_1'],
            $data['eng_school_1'],
            $data['eng_result_1']
        );
        
        if (!$stmt->execute()) {
            throw new Exception("English Qualification insert failed: " . $stmt->error);
        }
    }
    $stmt->close();

    // 6. Insert Medical Details
    $stmt = $conn->prepare("INSERT INTO MedicalDetails (StudentID, Disability, Details) VALUES (?, ?, ?)");
    
    $disability = $data['medical_condition'] === 'yes' ? 'Yes' : 'No';
    $stmt->bind_param("iss",
        $studentId,
        $disability,
        $data['medical_details']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Medical Details insert failed: " . $stmt->error);
    }
    $stmt->close();

    // 7. Insert Emergency Contact Details
    $stmt = $conn->prepare("INSERT INTO EmergencyContactDetails (StudentID, PersonName, Occupation, Relationship, MobileNo, Email, OfficeTelNo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("issssss",
        $studentId,
        $data['emergency_contact_name'],
        $data['emergency_contact_occupation'],
        $data['emergency_contact_relationship'],
        $data['emergency_contact_mobile'],
        $data['emergency_contact_email'],
        $data['emergency_contact_office']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Emergency Contact insert failed: " . $stmt->error);
    }
    $stmt->close();

    // 8. Insert Office Use Entry
    $stmt = $conn->prepare("INSERT INTO OfficeUse (StudentID, ApplicationStatus) VALUES (?, 'Pending')");
    
    $stmt->bind_param("i", $studentId);
    
    if (!$stmt->execute()) {
        throw new Exception("Office Use insert failed: " . $stmt->error);
    }
    $stmt->close();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success", 
        "message" => "Registration successful.",
        "id" => $studentId
    ]);

} catch (Exception $e) {
    // Log the detailed error
    $errorMessage = date('[Y-m-d H:i:s] ') . "Database Error: " . $e->getMessage() . 
                   "\nTrace: " . $e->getTraceAsString() . "\n";
    file_put_contents('error.log', $errorMessage, FILE_APPEND);
    
    // Rollback transaction if an error occurred
    if (isset($conn) && $conn->connect_errno === 0) {
        $conn->rollback();
    }
    
    // Send a sanitized error message to the client
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "error", 
        "message" => "Database error occurred",
        "debug_id" => uniqid() // Add a unique identifier to correlate with logs
    ]);
    
    // Clean up if needed
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
    exit;
}

// Close connection
$conn->close();
?>