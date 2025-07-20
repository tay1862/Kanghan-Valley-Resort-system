# Firebase API Endpoints / Functions Overview

For Kanghan Valley Resort & Camping, most data interactions will be handled directly via Firebase SDK (Firestore/Authentication) from the Frontend and Admin Dashboard. However, some complex logic or sensitive operations will utilize Firebase Functions.

## Firebase Functions (Cloud Functions for Firebase)

### 1. Authentication & User Management
- **`createUser` (HTTPS Callable):** Creates a new user in Firebase Authentication with a specified role (manager, reception, housekeeping). Only accessible by `manager` role.
  - **Input:** `email`, `password`, `role`, `name`
  - **Output:** `uid`, `email`, `role`
- **`deleteUser` (HTTPS Callable):** Deletes a user from Firebase Authentication and their corresponding `users` document. Only accessible by `manager` role.
  - **Input:** `uid`
  - **Output:** `success: boolean`

### 2. Booking Management
- **`createBooking` (HTTPS Callable):** Creates a new booking entry in the `bookings` collection. Includes logic for calculating deposit and remaining amounts.
  - **Input:** `roomId`, `guestName`, `phoneNumber`, `email`, `checkInDate`, `checkOutDate`, `numberOfGuests`, `notes`
  - **Output:** `bookingId`
- **`updateBookingStatus` (HTTPS Callable):** Updates the status of a booking (e.g., `confirmed`, `checked_in`, `checked_out`, `cancelled`).
  - **Input:** `bookingId`, `newStatus`
  - **Output:** `success: boolean`

### 3. Room Management
- **`updateRoomStatus` (HTTPS Callable):** Updates the `status` of a specific room (e.g., `available`, `occupied`, `maintenance`). This is primarily for housekeeping/admin internal use and does not directly block bookings.
  - **Input:** `roomId`, `newStatus`
  - **Output:** `success: boolean`

### 4. Invoice Generation (Backend Logic)
- **`generateInvoicePdf` (HTTPS Callable):** Generates a PDF invoice based on a `bookingId`. This function will fetch booking details, room details, and invoice settings, then use a PDF generation library to create the document.
  - **Input:** `bookingId`
  - **Output:** `pdfBase64: string` (Base64 encoded PDF file)

### 5. Website Settings & Content Management
- **`updateWebsiteSettings` (HTTPS Callable):** Updates the `website_settings` document. Accessible by `manager` role.
  - **Input:** `settingsData` (object containing fields to update)
  - **Output:** `success: boolean`
- **`updateLanguageString` (HTTPS Callable):** Updates a specific language string in the `languages` collection. Accessible by `manager` role.
  - **Input:** `key`, `language`, `value`
  - **Output:** `success: boolean`

## Direct Firebase SDK Usage (Frontend & Admin Dashboard)

Most read/write operations for non-sensitive data will be handled directly via Firebase SDK with appropriate Firestore Security Rules.

### Firestore (Client-side access with Security Rules)
- **`rooms` collection:** Read/write for room details (except `status` which might be updated via function).
- **`bookings` collection:** Read/write for booking details (for display and basic updates).
- **`website_settings` document:** Read access for frontend to display content.
- **`languages` collection:** Read access for frontend to display multi-language content.

### Firebase Authentication
- User login/logout.
- Password reset.

### Firebase Storage
- Uploading/downloading room images and gallery images.
- Storing generated PDF invoices temporarily.

## Multi-language Strategy

All user-facing text (frontend content, room descriptions, invoice notes) will be stored in Firestore within `languages` collection or as nested objects in `website_settings` and `rooms` collections, with fields for `en`, `lo`, `th`. The frontend will dynamically load and display the appropriate language based on user selection.

