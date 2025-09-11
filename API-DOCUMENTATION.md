# Ganimi Backend API Documentation

This document provides comprehensive API documentation for the Ganimi backend application. All API endpoints are prefixed with `/api/v1`.

## Base URL
```
http://localhost:5500/api/v1
```

## Authentication
The backend currently authenticates using HTTP-only cookies set by the server on login. These cookies include the access token and refresh token and are automatically sent with subsequent requests by the browser. Do not attempt to read them via JavaScript (they are httpOnly).

Planned: Bearer tokens in the `Authorization` header will also be supported later. When available, the format will be:
```
Authorization: Bearer <your-jwt-token>
```

For now, ensure that requests are made with credentials so cookies are included:
- Browser fetch: `credentials: 'include'`
- Axios: `withCredentials: true`

## User Roles
- `super_admin`: Full access to all resources
- `vendor`: Can manage their own services and bookings
- `student`: Can view services they have access to and make bookings

---

## 1. Authentication Routes (`/auth`)

### POST `/auth/register`
**Purpose**: Register a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "User Created"
}
```

### POST `/auth/login`
**Purpose**: Login user and get authentication tokens

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "User Logged In",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### GET `/auth/me`
**Purpose**: Get current user profile information

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`).

**Response**:
```json
{
  "status": "ok",
  "message": "User retrieved",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### GET `/auth/:id`
**Purpose**: Get user information by ID

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Response**:
```json
{
  "status": "ok",
  "message": "User Retrieved",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### POST `/auth/update`
**Purpose**: Update current user profile

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "address": "123 Main St",
  "pincode": "12345"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "User Updated"
}
```

### POST `/auth/logout`
**Purpose**: Logout user and invalidate tokens

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Response**:
```json
{
  "status": "ok",
  "message": "User Logged Out"
}
```

---

## 2. Admin Routes (`/admin`)
**Access**: Super Admin only

### GET `/admin/students`
**Purpose**: Get all students in the system

**Response**:
```json
{
  "status": "success",
  "students": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/admin/students/:id`
**Purpose**: Get specific student by ID

**Response**:
```json
{
  "status": "success",
  "student": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  ]
}
```

### GET `/admin/students/:id/bookings`
**Purpose**: Get all bookings for a specific student

**Response**:
```json
{
  "status": "success",
  "bookings": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "bookingDate": "2024-01-01T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

### GET `/admin/students/:id/categories`
**Purpose**: Get category access for a specific student

**Response**:
```json
{
  "status": "success",
  "categories": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "categoryId": "uuid"
    }
  ]
}
```

### GET `/admin/students/:id/orders`
**Purpose**: Get all orders for a specific student

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

### GET `/admin/vendors`
**Purpose**: Get all vendors in the system

**Response**:
```json
{
  "status": "success",
  "vendors": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "vendor"
    }
  ]
}
```

### GET `/admin/vendors/:id`
**Purpose**: Get specific vendor by ID

**Response**:
```json
{
  "status": "success",
  "vendor": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "vendor"
    }
  ]
}
```

### GET `/admin/vendors/:id/bookings`
**Purpose**: Get all bookings for a specific vendor

**Response**:
```json
{
  "status": "success",
  "bookings": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "status": "pending"
    }
  ]
}
```

### GET `/admin/vendors/:id/services`
**Purpose**: Get all services for a specific vendor

**Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "categoryId": "uuid",
      "name": "Math Tutoring",
      "price": "50.00"
    }
  ]
}
```

### GET `/admin/categories`
**Purpose**: Get all categories in the system

**Response**:
```json
{
  "status": "success",
  "categories": [
    {
      "id": "uuid",
      "name": "Tutoring",
      "description": "Academic tutoring services"
    }
  ]
}
```

### GET `/admin/categories/:id`
**Purpose**: Get specific category by ID

**Response**:
```json
{
  "status": "success",
  "category": [
    {
      "id": "uuid",
      "name": "Tutoring",
      "description": "Academic tutoring services"
    }
  ]
}
```

### GET `/admin/services`
**Purpose**: Get all services in the system

**Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "categoryId": "uuid",
      "name": "Math Tutoring",
      "description": "One-on-one math tutoring",
      "price": "50.00"
    }
  ]
}
```

### GET `/admin/services/:id`
**Purpose**: Get specific service by ID

**Response**:
```json
{
  "status": "success",
  "service": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "categoryId": "uuid",
      "name": "Math Tutoring",
      "price": "50.00"
    }
  ]
}
```

### GET `/admin/services/categories/:id`
**Purpose**: Get all services for a specific category

**Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "categoryId": "uuid",
      "name": "Math Tutoring",
      "price": "50.00"
    }
  ]
}
```

### GET `/admin/bookings`
**Purpose**: Get all bookings in the system

**Response**:
```json
{
  "status": "success",
  "bookings": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "bookingDate": "2024-01-01T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

### GET `/admin/bookings/:id`
**Purpose**: Get specific booking by ID

**Response**:
```json
{
  "status": "success",
  "booking": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "status": "pending"
    }
  ]
}
```

### GET `/admin/payments`
**Purpose**: Get all payments in the system

**Response**:
```json
{
  "status": "success",
  "payments": []
}
```

### GET `/admin/orders`
**Purpose**: Get all orders in the system

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

### GET `/admin/orders/:id`
**Purpose**: Get specific order by ID

**Response**:
```json
{
  "status": "success",
  "order": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

---

## 3. Categories Routes (`/categories`)
**Access**: Super Admin only

### GET `/categories`
**Purpose**: Get all categories

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Response**:
```json
{
  "status": "ok",
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Tutoring",
      "description": "Academic tutoring services",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/categories`
**Purpose**: Create a new category

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Request Body**:
```json
{
  "name": "Music Lessons",
  "description": "Music instrument and vocal training services"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Music Lessons",
    "description": "Music instrument and vocal training services"
  }
}
```

### PUT `/categories/:id`
**Purpose**: Update an existing category

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Request Body**:
```json
{
  "name": "Updated Music Lessons",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "Category updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Music Lessons",
    "description": "Updated description"
  }
}
```

### DELETE `/categories/:id`
**Purpose**: Delete a category

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Response**:
```json
{
  "status": "ok",
  "message": "Category deleted successfully",
  "data": {}
}
```

---

## 4. Services Routes (`/services`)

### GET `/services`
**Purpose**: Get services based on user role
- Super Admin: All services
- Student: Services from categories they have access to
- Vendor: Their own services

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Response**:
```json
{
  "status": "ok",
  "message": "Services fetched successfully",
  "data": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "categoryId": "uuid",
      "name": "Math Tutoring",
      "description": "One-on-one math tutoring",
      "address": "123 Main St",
      "pincode": "12345",
      "price": "50.00",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/services`
**Purpose**: Create a new service (Vendor only)

**Headers**: Cookie-based auth (HTTP-only). Send credentials with requests (fetch: `credentials: 'include'`, axios: `withCredentials: true`). Bearer Authorization header support coming later.

**Request Body**:
```json
{
  "name": "Math Tutoring",
  "description": "One-on-one math tutoring for high school students",
  "categoryId": "uuid",
  "address": "123 Main St",
  "pincode": "12345",
  "price": "50.00"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "Service created successfully",
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "categoryId": "uuid",
    "name": "Math Tutoring",
    "price": "50.00"
  }
}
```

### PUT `/services/:id`
**Purpose**: Update an existing service (Owner only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Advanced Math Tutoring",
  "description": "Advanced math tutoring for college students",
  "categoryId": "uuid",
  "address": "456 Oak Ave",
  "pincode": "54321",
  "price": "75.00"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "Service updated successfully",
  "data": {
    "id": "uuid",
    "name": "Advanced Math Tutoring",
    "price": "75.00"
  }
}
```

### DELETE `/services/:id`
**Purpose**: Delete a service (Owner only)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "ok",
  "message": "Service deleted successfully",
  "data": {}
}
```

---

## 5. Bookings Routes (`/bookings`)

### GET `/bookings`
**Purpose**: Get bookings based on user role
- Super Admin: All bookings
- Student: Their own bookings
- Vendor: Bookings for their services

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "ok",
  "message": "Bookings fetched successfully",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "bookingDate": "2024-01-01T00:00:00Z",
      "status": "pending",
      "notes": "Please bring calculator"
    }
  ]
}
```

### GET `/bookings/:id`
**Purpose**: Get specific booking by ID

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "ok",
  "message": "Booking fetched successfully",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "serviceId": "uuid",
      "status": "pending"
    }
  ]
}
```

### PUT `/bookings/:id`
**Purpose**: Update booking status

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "Booking updated successfully",
  "data": {
    "id": "uuid",
    "status": "confirmed"
  }
}
```

### DELETE `/bookings/:id`
**Purpose**: Delete a booking

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "ok",
  "message": "Booking deleted successfully",
  "data": {}
}
```

---

## 6. Orders Routes (`/orders`)

### GET `/orders`
**Purpose**: Get orders based on user role
- Super Admin: All orders
- Student: Their own orders
- Vendor: Orders for their services

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "razorpayOrderId": "order_123",
      "studentId": "uuid",
      "vendorId": "uuid",
      "amount": "100.00",
      "type": "category",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/orders/:id`
**Purpose**: Get specific order by ID

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "success",
  "order": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "vendorId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

### GET `/orders/student/:studentId`
**Purpose**: Get all orders for a specific student

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

### GET `/orders/vendor/:vendorId`
**Purpose**: Get all orders for a specific vendor

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

### GET `/orders/category/:categoryId`
**Purpose**: Get all orders for a specific category

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "status": "success",
  "orders": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "amount": "100.00",
      "status": "completed"
    }
  ]
}
```

---

## 7. Payments Routes (`/payments`)

### POST `/payments/verify`
**Purpose**: Verify Razorpay payment webhook

**Request Body**:
```json
{
  "razorpay_order_id": "order_123",
  "razorpay_payment_id": "pay_456",
  "razorpay_signature": "signature_789"
}
```

**Response**:
```json
{
  "status": "ok",
  "amount": "100.00"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Unexpected error occurred, Try again later"
}
```

---

## Data Models

### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string (hashed)",
  "role": "super_admin | vendor | student",
  "address": "string",
  "pincode": "string",
  "latitude": "string",
  "longitude": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Category
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Service
```json
{
  "id": "uuid",
  "vendorId": "uuid",
  "categoryId": "uuid",
  "name": "string",
  "description": "string",
  "address": "string",
  "pincode": "string",
  "latitude": "string",
  "longitude": "string",
  "price": "decimal",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Booking
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "vendorId": "uuid",
  "serviceId": "uuid",
  "bookingDate": "datetime",
  "status": "pending | confirmed | cancelled | completed",
  "notes": "string"
}
```

### Order
```json
{
  "id": "uuid",
  "razorpayOrderId": "string",
  "razorpayPaymentId": "string",
  "razorpaySignature": "string",
  "studentId": "uuid",
  "vendorId": "uuid",
  "bookingId": "uuid",
  "categoryId": "uuid",
  "amount": "decimal",
  "type": "category | category_all | booking",
  "status": "pending | confirmed | cancelled | completed",
  "createdAt": "datetime"
}
```

---

## Authentication Flow

1. **Register/Login**: User registers or logs in via `/auth/register` or `/auth/login`
2. **Token Storage**: Frontend stores the JWT token (usually in localStorage or cookies)
3. **API Calls**: Include token in Authorization header for protected routes
4. **Token Refresh**: Use refresh token mechanism for token renewal
5. **Logout**: Call `/auth/logout` to invalidate tokens

---

## Role-Based Access Control

- **Super Admin**: Full access to all resources and admin endpoints
- **Vendor**: Can manage their own services and view their bookings/orders
- **Student**: Can view services they have access to, make bookings, and view their orders

---

## Notes for Frontend Developers

1. **Base URL**: All API calls should be made to `http://localhost:5500/api/v1`
2. **Authentication**: Store JWT tokens securely and include in Authorization header
3. **Error Handling**: Always handle error responses and display appropriate messages
4. **Loading States**: Implement loading states for better UX
5. **Form Validation**: Validate forms on frontend before API calls
6. **Role-Based UI**: Show/hide features based on user role
7. **Real-time Updates**: Consider implementing WebSocket or polling for real-time updates
8. **File Uploads**: Currently not implemented, but can be added if needed
9. **Pagination**: Not implemented, but can be added for large datasets
10. **Search/Filter**: Not implemented, but can be added for better user experience
