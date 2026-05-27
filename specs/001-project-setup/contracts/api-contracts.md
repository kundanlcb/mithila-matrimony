# API Interface Contracts: Mithila Matrimony

This document outlines the REST API endpoint interfaces that the frontend mock database implements in Phase One, which will be fully implemented by the Spring Boot backend in subsequent phases.

---

## 1. Authentication & OTP Services

### Request OTP
Issues a verification code to a user's mobile number.

*   **Endpoint**: `POST /api/auth/otp/send`
*   **Request Body**:
    ```json
    {
      "mobileNumber": "+919876543210"
    }
    ```
*   **Responses**:
    *   **200 OK**: OTP sent successfully.
        ```json
        {
          "success": true,
          "message": "OTP sent successfully (Simulated code: 123456)"
        }
        ```
    *   **400 Bad Request**: Invalid mobile number.
        ```json
        {
          "success": false,
          "message": "Mobile number must be in valid E.164 format."
        }
        ```

### Verify OTP
Verifies the submitted verification code to establish authentication status.

*   **Endpoint**: `POST /api/auth/otp/verify`
*   **Request Body**:
    ```json
    {
      "mobileNumber": "+919876543210",
      "otpCode": "123456"
    }
    ```
*   **Responses**:
    *   **200 OK**: Authentication verified.
        ```json
        {
          "success": true,
          "token": "simulated-jwt-token-string",
          "registrationStep": "biodata"
        }
        ```
    *   **401 Unauthorized**: Incorrect or expired OTP.
        ```json
        {
          "success": false,
          "message": "Invalid verification code. Please try again."
        }
        ```

---

## 2. Biodata & Registration Services

### Submit Biodata
Creates or updates the user's matrimonial profile biodata details.

*   **Endpoint**: `POST /api/profiles/biodata`
*   **Request Headers**: `Authorization: Bearer <token>`
*   **Request Body**:
    ```json
    {
      "fullName": "Maithili Thakur",
      "gender": "Female",
      "age": 24,
      "gotra": "Kashyap",
      "profession": "Classical Musician",
      "annualIncome": 2500000,
      "location": "Darbhanga",
      "education": "M.A. Music",
      "interests": ["Singing", "Reading", "Travel"],
      "photoUrl": "https://example.com/profiles/maithili.jpg",
      "aboutMe": "Dedicated to cultural preservation through classical music. Looking for a partner who respects traditional values."
    }
    ```
*   **Responses**:
    *   **200 OK**: Profile updated.
        ```json
        {
          "success": true,
          "biodataId": "biodata-uuid-v4-value",
          "registrationStep": "completed"
        }
        ```

---

## 3. Browsing & Matches Services

### Get Matching Profiles
Queries other registered profiles scoring high on compatibility criteria.

*   **Endpoint**: `GET /api/matches`
*   **Request Headers**: `Authorization: Bearer <token>`
*   **Query Parameters**:
    *   `minAge`: minimum age limit (optional)
    *   `maxAge`: maximum age limit (optional)
    *   `gotra`: comma separated excluded or preferred gotras (optional)
*   **Responses**:
    *   **200 OK**: Matches list.
        ```json
        [
          {
            "userId": "user-uuid-1",
            "fullName": "Aarav Mishra",
            "gender": "Male",
            "age": 27,
            "gotra": "Shandilya",
            "profession": "Software Architect",
            "annualIncome": 3600000,
            "location": "Bangalore",
            "education": "B.Tech CSE",
            "photoUrl": "https://example.com/profiles/aarav.jpg",
            "aboutMe": "Software enthusiast from Patna, now based in Bangalore. Looking for a compatible life partner.",
            "compatibilityScore": 85
          }
        ]
        ```
