# Razorpay Payment Utilities Usage Guide

This guide explains how to use the Razorpay payment utility functions in your application.

## Available Functions

### 1. `initiateServicePayment(paymentData, serviceName, options)`

Use this function to handle payments for booking services. You need to create the order first and pass the payment data.

```javascript
import { initiateServicePayment } from "@/lib/razorpay";

const handleBookService = async (serviceId, serviceName) => {
  try {
    // Create order first
    const response = await fetch(`http://localhost:5500/api/v1/orders/service/${serviceId}`, {
      credentials: "include",
      method: "POST",
    });
    
    const paymentData = await response.json();
    
    if (paymentData.status === "error") {
      toast.error(paymentData.message);
      return;
    }

    // Use utility function with payment data
    await initiateServicePayment(paymentData, serviceName, {
      successMessage: "Booking successful! Your service has been booked.",
      onSuccess: (data, response) => {
        console.log("Payment completed:", data);
        // Redirect to booking confirmation page
        router.push(`/bookings/${response.razorpay_payment_id}`);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
        // Handle payment failure
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to initiate payment");
  }
};
```

### 2. `initiateCategoryPayment(paymentData, categories, options)`

Use this function to handle payments for purchasing category access. Supports both single category and multiple categories.

```javascript
import { initiateCategoryPayment } from "@/lib/razorpay";

// Single category purchase
const handlePurchaseSingleCategory = async (categoryId, categoryName) => {
  try {
    // Create order first
    const response = await fetch(`http://localhost:5500/api/v1/orders/category/${categoryId}`, {
      credentials: "include",
      method: "POST",
    });
    
    const paymentData = await response.json();
    
    if (paymentData.status === "error") {
      toast.error(paymentData.message);
      return;
    }

    // Use utility function with payment data
    await initiateCategoryPayment(paymentData, categoryName, {
      successMessage: "Access granted! You can now view all services in this category.",
      onSuccess: (data, response) => {
        console.log("Category access purchased:", data);
        // Refresh the page or redirect
        window.location.reload();
      },
      onError: (error) => {
        console.error("Purchase failed:", error);
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to initiate payment");
  }
};

// Multiple categories purchase
const handlePurchaseMultipleCategories = async (categoryIds, categoryNames) => {
  try {
    // Create order for multiple categories
    const response = await fetch(`http://localhost:5500/api/v1/orders/categories`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryIds }),
    });
    
    const paymentData = await response.json();
    
    if (paymentData.status === "error") {
      toast.error(paymentData.message);
      return;
    }

    // Use utility function with payment data and multiple categories
    await initiateCategoryPayment(paymentData, categoryNames, {
      successMessage: "Access granted! You now have access to all selected categories.",
      onSuccess: (data, response) => {
        console.log("Multiple categories purchased:", data);
        // Refresh or redirect
        window.location.reload();
      },
      onError: (error) => {
        console.error("Purchase failed:", error);
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to initiate payment");
  }
};
```

### 3. `initiateCustomPayment(paymentData, name, description, options)`

Use this function for custom payment scenarios with pre-fetched payment data.

```javascript
import { initiateCustomPayment } from "@/lib/razorpay";

const handleCustomPayment = async () => {
  try {
    // Create custom order first
    const response = await fetch("http://localhost:5500/api/v1/orders/custom", {
      credentials: "include",
      method: "POST",
    });
    
    const paymentData = await response.json();
    
    if (paymentData.status === "error") {
      toast.error(paymentData.message);
      return;
    }

    await initiateCustomPayment(
      paymentData,
      "Ganimi - Premium Subscription",
      "Monthly premium subscription",
      {
        successMessage: "Subscription activated successfully!",
        onSuccess: (data, response) => {
          console.log("Subscription payment completed:", data);
          // Update user subscription status
          updateUserSubscription(data);
        },
        onError: (error) => {
          console.error("Subscription payment failed:", error);
        }
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to initiate payment");
  }
};
```

## Options Parameter

All functions accept an optional `options` object with the following properties:

- `successMessage` (string): Custom success message to display
- `onSuccess` (function): Callback function called on successful payment
  - Parameters: `(data, response)` where `data` is the verification response and `response` is the Razorpay response
- `onError` (function): Callback function called on payment failure
  - Parameters: `(error)` where `error` is the error object

## Error Handling

The utility functions handle common errors automatically:
- Invalid script loading
- Network errors
- Payment verification failures

You can provide additional error handling through the `onError` callback.

## Security Features

- Script source validation (only allows Razorpay CDN)
- HTTPS enforcement
- Proper error handling and logging

## Example Usage in Components

### In a Service Card Component

```javascript
"use client";

import { initiateServicePayment } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  const handleBook = async () => {
    await initiateServicePayment(service.id, service.name, {
      successMessage: `Successfully booked ${service.name}!`,
      onSuccess: () => {
        // Update UI or redirect
        router.push('/my-bookings');
      }
    });
  };

  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p>₹{service.price}</p>
      <Button onClick={handleBook}>Book Now</Button>
    </div>
  );
}
```

### In a Category Access Component

```javascript
"use client";

import { initiateCategoryPayment } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";

export default function CategoryAccess({ category, onAccessGranted }) {
  const handlePurchase = async () => {
    await initiateCategoryPayment(category.id, category.name, {
      onSuccess: () => {
        onAccessGranted();
      }
    });
  };

  return (
    <div className="category-access">
      <h3>Unlock {category.name}</h3>
      <p>Get access to all services in this category</p>
      <Button onClick={handlePurchase}>Purchase Access - ₹{category.price}</Button>
    </div>
  );
}
```

## Benefits of Using These Utilities

1. **DRY Principle**: No need to repeat Razorpay integration code
2. **Consistent Error Handling**: Standardized error messages and handling
3. **Security**: Built-in validation and security checks
4. **Flexibility**: Customizable success/error callbacks and messages
5. **Maintainability**: Single place to update Razorpay configuration
6. **Type Safety**: Clear function signatures and parameter validation
