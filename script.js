document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    let currentStep = 1;
    const totalSteps = 7;
    const formData = {};

    // Form step templates
    const formSteps = {
        1: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="book-open"></i>
                </div>
                <h2>1. Preliminary Information</h2>
            </div>
            <div class="instructions">
                <p>1. Please complete in block letters</p>
                <p>2. Tick (✓) where applicable</p>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Course <span class="required">*</span></label>
                    <input type="text" name="course" required>
                </div>
                <div class="form-group">
                    <label>Semester <span class="required">*</span></label>
                    <select name="semester" required>
                        <option value="">Select Semester</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                        <option value="Summer">Summer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Intake <span class="required">*</span></label>
                    <input type="month" name="intake" min="${new Date().getFullYear()}-01" required>
                    <small class="help-text">Please select your intake month and year</small>
                </div>
                <div class="form-group">
                    <label>How did you hear about us? <span class="required">*</span></label>
                    <select name="referralSource" required>
                        <option value="">Select Source</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Open Day">Open Day</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Education Fair">Education Fair</option>
                        <option value="Friend">Introduced by Friends</option>
                        <option value="Telemarketing">Telemarketing</option>
                        <option value="Other">Others</option>
                    </select>
                </div>
            </div>
            <div class="note">
                <p class="note-text">Student No.: _________________ (For office use only)</p>
            </div>
        `,
        2: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="user"></i>
                </div>
                <h2>2. Personal Information</h2>
            </div>
            <div class="form-grid">
                <div class="form-group full-width">
                    <label>Name (as per IC/Passport) <span class="required">*</span></label>
                    <input type="text" name="fullName" required>
                </div>
                <div class="form-group">
                    <label>IC/Passport No. <span class="required">*</span></label>
                    <input type="text" name="icPassport" required>
                </div>
                <div class="form-group">
                    <label>Place of Birth <span class="required">*</span></label>
                    <input type="text" name="placeOfBirth" placeholder="Village > District > Region" required>
                </div>
                <div class="form-group">
                    <label>Race</label>
                    <input type="text" name="race">
                </div>
                <div class="form-group">
                    <label>Religion</label>
                    <input type="text" name="religion">
                </div>
                <div class="form-group">
                   <label>Date of Birth <span class="required">*</span></label>
                   <input type="date" name="dateOfBirth" max="${new Date().toISOString().split('T')[0]}" required>
                   <small class="help-text">Please select your date of birth</small>
                </div>
                <div class="form-group">
                    <label>Marital Status</label>
                    <select name="maritalStatus">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widow/Widower</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Gender <span class="required">*</span></label>
                    <select name="gender" required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" name="age">
                </div>
                <div class="form-group">
                    <label>Nationality <span class="required">*</span></label>
                    <input type="text" name="nationality" required>
                </div>
                <div class="form-group full-width">
                    <label>Current Address <span class="required">*</span></label>
                    <textarea name="currentAddress" required></textarea>
                </div>
                <div class="form-group">
                    <label>Telephone No.</label>
                    <div class="phone-input">
                        <input type="text" name="countryCode" placeholder="Country Code">
                        <input type="text" name="phoneNumber" placeholder="Number">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email <span class="required">*</span></label>
                    <input type="email" name="email" required>
                </div>
            </div>
        `,
        3: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="users"></i>
                </div>
                <h2>3. Parent Information</h2>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Father's Name (Guardian)</label>
                    <input type="text" name="fatherName">
                </div>
                <div class="form-group">
                    <label>Mother's Name (Guardian)</label>
                    <input type="text" name="motherName">
                </div>
                <div class="form-group">
                    <label>Telephone No.</label>
                    <input type="tel" name="parentPhone">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="parentEmail">
                </div>
                <div class="form-group full-width">
                    <label>Company Name and Address</label>
                    <textarea name="companyAddress"></textarea>
                </div>
                <div class="form-group">
                    <label>Occupation</label>
                    <input type="text" name="parentOccupation">
                </div>
            </div>
        `,
        4: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="graduation-cap"></i>
                </div>
                <h2>4. Academic Information</h2>
            </div>
            <div class="academic-table">
                <h3>Academic/Professional Qualifications</h3>
                <table class="qualification-table">
                    <thead>
                        <tr>
                            <th>Date of Examination</th>
                            <th>Name of Examination</th>
                            <th>Name of School</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="date" name="exam_date_1" max="${new Date().toISOString().split('T')[0]}"></td>
                            <td><input type="text" name="exam_name_1"></td>
                            <td><input type="text" name="school_name_1"></td>
                            <td><input type="text" name="result_1"></td>
                        </tr>
                        <tr>
                            <td><input type="date" name="exam_date_2" max="${new Date().toISOString().split('T')[0]}"></td>
                            <td><input type="text" name="exam_name_2"></td>
                            <td><input type="text" name="school_name_2"></td>
                            <td><input type="text" name="result_2"></td>
                        </tr>
                    </tbody>
                </table>

                <h3>English Language Qualifications</h3>
                <table class="qualification-table">
                    <thead>
                        <tr>
                            <th>Date of Examination</th>
                            <th>Name of Examination</th>
                            <th>Name of School</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="date" name="eng_exam_date_1" max="${new Date().toISOString().split('T')[0]}"></td>
                            <td><input type="text" name="eng_exam_name_1"></td>
                            <td><input type="text" name="eng_school_1"></td>
                            <td><input type="text" name="eng_result_1"></td>
                        </tr>
                    </tbody>
                </table>

                <div class="medical-section">
                    <h3>Medical Details</h3>
                    <div class="form-group">
                        <label>Do you have any disability/impairment/long-term medical conditions that may affect your study?</label>
                        <div class="radio-group">
                            <label><input type="radio" name="medical_condition" value="yes"> Yes</label>
                            <label><input type="radio" name="medical_condition" value="no"> No</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>If yes, please provide details:</label>
                        <textarea name="medical_details"></textarea>
                    </div>
                </div>

                <div class="declaration-section">
                    <h3>Declaration</h3>
                    <p>We confirm that, to the best of our knowledge, the information provided in this form is correct and complete. We have read and understand the instructions clearly and abide by all the terms and conditions.</p>
                    <div class="signature-grid">
                        <div class="signature-block">
                            <label>Applicant's Signature</label>
                            <div class="signature-line"></div>
                            <label>Date: <input type="date" name="applicant_sign_date"></label>
                        </div>
                        <div class="signature-block">
                            <label>Parent/Guardian's Signature</label>
                            <div class="signature-line"></div>
                            <label>Date: <input type="date" name="guardian_sign_date"></label>
                        </div>
                    </div>
                </div>
            </div>
        `,
        5: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="phone-call"></i>
                </div>
                <h2>5. Emergency Contact Details</h2>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Person Name <span class="required">*</span></label>
                    <input type="text" name="emergency_contact_name" required>
                </div>
                <div class="form-group">
                    <label>Occupation</label>
                    <input type="text" name="emergency_contact_occupation">
                </div>
                <div class="form-group">
                    <label>Relationship <span class="required">*</span></label>
                    <input type="text" name="emergency_contact_relationship" required>
                </div>
                <div class="form-group">
                    <label>Mobile No. <span class="required">*</span></label>
                    <input type="tel" name="emergency_contact_mobile" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="emergency_contact_email">
                </div>
                <div class="form-group">
                    <label>Office Tel. No.</label>
                    <input type="tel" name="emergency_contact_office">
                </div>
            </div>
        `,
        6: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="file-text"></i>
                </div>
                <h2>6. Terms and Conditions</h2>
            </div>
            <div class="terms-section">
                <div class="terms-content">
                    <h3>General Terms</h3>
                    <ol class="terms-list">
                        <li>All fees paid are strictly non-refundable and non-transferable.</li>
                        <li>The institution reserves the right to vary or reverse any decision regarding admission or enrollment made on the basis of incorrect or incomplete information.</li>
                        <li>Students must comply with all institutional policies, procedures, and regulations.</li>
                        <li>The institution reserves the right to change any information without prior notice.</li>
                    </ol>

                    <h3>Payment Terms</h3>
                    <ol class="terms-list">
                        <li>All fees must be paid according to the payment schedule provided.</li>
                        <li>Late payment fees will be charged for overdue payments.</li>
                        <li>The institution reserves the right to suspend students from classes for non-payment of fees.</li>
                    </ol>

                    <h3>Academic Requirements</h3>
                    <ol class="terms-list">
                        <li>Students must maintain satisfactory academic progress.</li>
                        <li>Regular attendance is mandatory for all classes.</li>
                        <li>Students must complete all required coursework and examinations.</li>
                    </ol>
                </div>
                
                <div class="terms-acceptance">
                    <label class="checkbox-container">
                        <input type="checkbox" name="terms_accepted" required>
                        <span class="checkmark"></span>
                        I have read and agree to the terms and conditions
                    </label>
                </div>
            </div>
        `,
        7: `
            <div class="step-header">
                <div class="icon-wrapper">
                    <i data-lucide="clipboard-list"></i>
                </div>
                <h2>7. Admission Procedure</h2>
            </div>
            <div class="admission-procedure">
                <div class="procedure-steps">
                    <h3>Required Documents</h3>
                    <ul class="document-checklist">
                        <li>
                            <label class="checkbox-container">
                                <input type="checkbox" name="doc_ic">
                                <span class="checkmark"></span>
                                Copy of IC/Passport
                            </label>
                        </li>
                        <li>
                            <label class="checkbox-container">
                                <input type="checkbox" name="doc_photo">
                                <span class="checkmark"></span>
                                4 Passport-size photographs
                            </label>
                        </li>
                        <li>
                            <label class="checkbox-container">
                                <input type="checkbox" name="doc_academic">
                                <span class="checkmark"></span>
                                Academic certificates and transcripts
                            </label>
                        </li>
                        <li>
                            <label class="checkbox-container">
                                <input type="checkbox" name="doc_english">
                                <span class="checkmark"></span>
                                English language qualification certificates (if applicable)
                            </label>
                        </li>
                    </ul>

                    <h3>Process Flow</h3>
                    <ol class="process-list">
                        <li>Submit completed application form with all required documents</li>
                        <li>Application review by admissions committee</li>
                        <li>Interview (if required)</li>
                        <li>Offer letter issuance</li>
                        <li>Payment of fees</li>
                        <li>Enrollment confirmation</li>
                    </ol>

                    <div class="office-use-section">
                        <h3>For Office Use Only</h3>
                        <div class="office-grid">
                            <div class="form-group">
                                <label>Application Status</label>
                                <select name="application_status" disabled>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Processed By</label>
                                <input type="text" name="processed_by" disabled>
                            </div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" name="processing_date" disabled>
                            </div>
                            <div class="form-group">
                                <label>Remarks</label>
                                <textarea name="office_remarks" disabled></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };


    function updateProgressBar() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
        
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function showStep(step) {
        document.getElementById('formContent').innerHTML = formSteps[step];
        lucide.createIcons();
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
        
        if (step === totalSteps) {
            nextBtn.innerHTML = 'Submit <i data-lucide="send"></i>';
            nextBtn.classList.add('btn-success');
        } else {
            nextBtn.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
            nextBtn.classList.remove('btn-success');
        }
        
        updateProgressBar();
    }

    // Next button click handler
    document.getElementById('nextBtn').addEventListener('click', async function() {
        if (currentStep === totalSteps) {
            if (validateCurrentStep()) {
                const formData = gatherFormData();
                const response = await submitForm(formData);
                if (response.status === 'success') {
                    alert('Registration successful!');
                    window.location.reload();
                }
            }
        } else if (validateCurrentStep()) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Previous button click handler
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
function validateCurrentStep() {
    const currentInputs = document.querySelectorAll(`#formContent input[required], #formContent select[required]`);
    let isValid = true;

    currentInputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('invalid');
        } else {
            // Date validation
            if (input.type === 'date') {
                const date = new Date(input.value);
                const today = new Date();
                
                if (input.name === 'dateOfBirth') {
                    // Validate age (must be at least 15 years old)
                    const minAge = 15;
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() - minAge);
                    
                    if (date > maxDate) {
                        isValid = false;
                        input.classList.add('invalid');
                        alert('You must be at least 15 years old to register');
                    }
                } else if (input.name === 'dateOfExamination') {
                    // Examination date cannot be in the future
                    if (date > today) {
                        isValid = false;
                        input.classList.add('invalid');
                        alert('Examination date cannot be in the future');
                    }
                }
            }
            // Month validation for intake
            else if (input.type === 'month') {
                const selectedDate = new Date(input.value);
                const today = new Date();
                const maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() + 2); // Allow registration up to 2 years in advance
                
                if (selectedDate < today || selectedDate > maxDate) {
                    isValid = false;
                    input.classList.add('invalid');
                    alert('Please select a valid intake date (between now and 2 years from now)');
                }
            }
            
            input.classList.remove('invalid');
        }
    });

    return isValid;
}

    function gatherFormData() {
        const formContent = document.getElementById('formContent');
        const inputs = formContent.querySelectorAll('input, select, textarea');
        const data = {};
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.name] = input.checked ? 'yes' : 'no';
            } else {
                data[input.name] = input.value;
            }
        });
        return data;
    }

    async function submitForm(data) {
        try {
            const response = await fetch('/submit_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form: ' + error.message);
            return { status: 'error', message: error.message };
        }
    }

    showStep(currentStep);
});