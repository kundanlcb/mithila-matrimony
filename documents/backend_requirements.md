# Comprehensive Backend Requirements: Mithila Matrimony

This document serves as the canonical specification for the Spring Boot backend REST API and PostgreSQL database schema.

---

## 1. Database Schema Specification (PostgreSQL)

### Table: `users`
Tracks core identity and authentication state.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` | Unique user identifier |
| `mobile_number` | `VARCHAR(15)` | Unique, Not Null | E.164 formatted (e.g. +919999999999) |
| `is_verified` | `BOOLEAN` | Default `false` | True after successful OTP |
| `registration_step` | `VARCHAR(20)` | Default `'auth'` | Enum: `auth`, `biodata`, `completed` |
| `preferred_language` | `VARCHAR(5)` | Default `'en'` | Enum: `en`, `hi` (for UI sync) |
| `theme_preference` | `VARCHAR(10)` | Default `'light'` | Enum: `light`, `dark` (for UI sync) |
| `created_at` | `TIMESTAMP` | Default `now()` | Registration timestamp |
| `updated_at` | `TIMESTAMP` | Default `now()` | Auto-updated on record change |

### Table: `biodata`
Stores user profile information captured during the conversational onboarding.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` | Unique biodata identifier |
| `user_id` | `UUID` | Foreign Key (`users.id`), Unique | 1:1 relationship with users |
| `full_name` | `VARCHAR(100)` | Nullable | - |
| `gender` | `VARCHAR(10)` | Nullable | Enum: `Male`, `Female` |
| `age` | `INTEGER` | Check `age >= 18 AND age <= 70` | - |
| `gotra` | `VARCHAR(50)` | Nullable | E.164 (Kashyap, Shandilya, etc.) |
| `profession` | `VARCHAR(100)` | Nullable | - |
| `annual_income` | `BIGINT` | Nullable | In INR |
| `location` | `VARCHAR(100)` | Nullable | City / State |
| `education` | `VARCHAR(255)` | Nullable | - |
| `about_me` | `TEXT` | Nullable | Personal bio |
| `photo_url` | `VARCHAR(512)` | Nullable | S3 bucket URL |
| `height` | `VARCHAR(20)` | Nullable | e.g. "5' 8"" |
| `marital_status`| `VARCHAR(30)` | Nullable | Enum: `Never Married`, `Divorced`, etc. |
| `diet` | `VARCHAR(30)` | Nullable | Enum: `Vegetarian`, `Non-Vegetarian` |
| `complexion` | `VARCHAR(30)` | Nullable | Enum: `Fair`, `Wheatish` |
| `interests` | `JSONB` | Default `'[]'` | Array of strings (hobbies) |

### Table: `match_criteria`
User's preferences for finding a partner.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` | - |
| `user_id` | `UUID` | Foreign Key (`users.id`), Unique | 1:1 relationship with users |
| `min_age` | `INTEGER` | Default `18` | - |
| `max_age` | `INTEGER` | Default `70` | - |
| `min_income` | `BIGINT` | Default `0` | Minimum annual income in INR |
| `marital_status`| `VARCHAR(30)` | Nullable | Preferred marital status |
| `diet` | `VARCHAR(30)` | Nullable | Preferred diet |
| `allowed_gotras`| `JSONB` | Default `'[]'` | Array of preferred gotras. Empty = All |
| `allowed_locations`| `JSONB` | Default `'[]'` | Array of preferred locations. Empty = All|
| `allowed_professions`| `JSONB` | Default `'[]'` | Array of preferred professions. |

### Table: `interactions`
Tracks likes, passes, and matches between profiles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` | - |
| `from_user_id` | `UUID` | Foreign Key (`users.id`) | Initiator |
| `to_user_id` | `UUID` | Foreign Key (`users.id`) | Target |
| `type` | `VARCHAR(20)` | Not Null | Enum: `interest_sent`, `shortlisted`, `passed`, `match_accepted`, `match_declined` |
| `timestamp` | `TIMESTAMP` | Default `now()` | - |

*Index Required*: `CREATE UNIQUE INDEX unique_interaction ON interactions (from_user_id, to_user_id, type);`

---

## 2. API Endpoints Specification

*Note: All endpoints (except `/auth/*`) require an `Authorization: Bearer <JWT>` header.*

### A. Authentication & Registration

#### 1. Request OTP
*   **Method**: `POST`
*   **Path**: `/api/v1/auth/request-otp`
*   **Auth Required**: No
*   **Description**: Generates a 6-digit OTP and sends it via SMS.
*   **Request Body**:
    ```json
    {
      "mobileNumber": "+919999999999"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "OTP sent successfully",
      "expiresInSeconds": 300
    }
    ```

#### 2. Verify OTP
*   **Method**: `POST`
*   **Path**: `/api/v1/auth/verify-otp`
*   **Auth Required**: No
*   **Description**: Validates the OTP. Creates the `User` and `Biodata` row if this is their first login.
*   **Request Body**:
    ```json
    {
      "mobileNumber": "+919999999999",
      "otp": "123456"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "mobileNumber": "+919999999999",
        "registrationStep": "biodata",
        "preferredLanguage": "en"
      }
    }
    ```

### B. Biodata (Conversational Onboarding)

#### 1. Get My Biodata
*   **Method**: `GET`
*   **Path**: `/api/v1/biodata/me`
*   **Auth Required**: Yes
*   **Response (200 OK)**:
    ```json
    {
      "id": "a1b2c3d4...",
      "fullName": "Rahul Jha",
      "gender": "Male",
      "age": 28,
      "gotra": "Kashyap",
      "profession": "Software Engineer",
      "interests": ["Reading", "Travel"]
      // ... other fields
    }
    ```

#### 2. Update Biodata (Partial)
*   **Method**: `PATCH`
*   **Path**: `/api/v1/biodata/me`
*   **Auth Required**: Yes
*   **Description**: Used during the chatbot onboarding to save answers step-by-step.
*   **Request Body (Example)**:
    ```json
    {
      "gotra": "Shandilya",
      "age": 29
    }
    ```
*   **Response (200 OK)**: Returns the updated full Biodata object.

#### 3. Complete Registration
*   **Method**: `POST`
*   **Path**: `/api/v1/biodata/me/complete`
*   **Auth Required**: Yes
*   **Description**: Validates that all required biodata fields are filled. If successful, updates the user's `registration_step` to `completed`.
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Registration completed",
      "registrationStep": "completed"
    }
    ```
*   **Response (400 Bad Request)**:
    ```json
    {
      "status": "error",
      "missingFields": ["fullName", "photoUrl"]
    }
    ```

### C. Matching & Discovery

#### 1. Fetch Matches
*   **Method**: `GET`
*   **Path**: `/api/v1/matches`
*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `page` (int, default 0)
    *   `size` (int, default 20)
    *   `sortBy` (string, enum: `score`, `age_asc`, `age_desc`, `income`)
*   **Description**: Returns profiles that fit the user's `MatchCriteria` and optionally sorts them (e.g., by highest income). Excludes profiles they have already interacted with (`passed`, `interest_sent`).
*   **Response (200 OK)**:
    ```json
    {
      "content": [
        {
          "id": "b2c3...",
          "fullName": "Sneha Mishra",
          "age": 26,
          "gotra": "Vatsa",
          "compatibilityScore": 85,
          "photoUrl": "https://s3.aws.com/..."
        }
      ],
      "totalPages": 5,
      "totalElements": 95
    }
    ```

#### 2. Update Match Criteria
*   **Method**: `PUT`
*   **Path**: `/api/v1/matches/criteria`
*   **Auth Required**: Yes
*   **Request Body**:
    ```json
    {
      "minAge": 24,
      "maxAge": 30,
      "minIncome": 1200000,
      "maritalStatus": "Never Married",
      "diet": "Vegetarian",
      "allowedGotras": ["Vatsa", "Kashyap"],
      "allowedLocations": []
    }
    ```
*   **Response (200 OK)**: Returns the updated Criteria object.

### D. Interactions

#### 1. Send Interaction
*   **Method**: `POST`
*   **Path**: `/api/v1/interactions`
*   **Auth Required**: Yes
*   **Description**: Used to "swipe right" (send interest) or "swipe left" (pass).
*   **Request Body**:
    ```json
    {
      "toUserId": "c3d4e5f6...",
      "type": "interest_sent" 
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "isMutualMatch": false
    }
    ```
    *(Note: If the `toUserId` had already sent an `interest_sent` to the active user, the backend should update both to `match_accepted` and return `isMutualMatch: true`)*.

#### 2. Get Received Interests
*   **Method**: `GET`
*   **Path**: `/api/v1/interactions/received`
*   **Auth Required**: Yes
*   **Description**: Fetches users who have sent an interest to the active user.
*   **Response (200 OK)**: List of Biodata objects representing the senders.

### E. Media Uploads

#### 1. Generate S3 Pre-signed URL
*   **Method**: `GET`
*   **Path**: `/api/v1/upload/presigned-url`
*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `fileName` (string, e.g. "profile.jpg")
    *   `contentType` (string, e.g. "image/jpeg")
*   **Description**: The frontend requests this URL, then makes an HTTP `PUT` request directly to AWS S3 using the provided URL to upload the image.
*   **Response (200 OK)**:
    ```json
    {
      "uploadUrl": "https://mithila-bucket.s3.amazonaws.com/users/uuid/profile.jpg?X-Amz-Signature=...",
      "fileUrl": "https://mithila-bucket.s3.amazonaws.com/users/uuid/profile.jpg"
    }
    ```
    *(The frontend will save `fileUrl` and send it back in the `PATCH /api/v1/biodata/me` request).*
