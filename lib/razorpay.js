"use client";

import { toast } from "sonner";

/**
 * Loads the Razorpay checkout script dynamically
 * @param {string} src - The script source URL
 * @returns {Promise<boolean>} - Returns true if script loads successfully
 */
const loadScript = (src) => {
  return new Promise((resolve) => {
    // Validate script source
    if (!src || typeof src !== 'string') {
      resolve(false);
      return;
    }
    
    // Only allow HTTPS and trusted domains
    if (!src.startsWith('https://checkout.razorpay.com/')) {
      console.error('Invalid script source:', src);
      resolve(false);
      return;
    }
    
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load script:', src);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates a Razorpay payment for a service
 * @param {Object} paymentData - The payment data from API
 * @param {string} paymentData.key - Razorpay key
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.orderId - Order ID
 * @param {string} serviceName - The name of the service
 * @param {Object} options - Additional options
 * @param {string} options.successMessage - Custom success message
 * @param {Function} options.onSuccess - Callback function on successful payment
 * @param {Function} options.onError - Callback function on payment error
 */
export const initiateServicePayment = async (paymentData, serviceName, options = {}) => {
  const {
    successMessage = "Payment successful",
    onSuccess,
    onError
  } = options;

  try {
    // Load Razorpay script
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!loaded) {
      toast.error("Failed to load Razorpay script");
      return;
    }

    // Configure Razorpay options
    const razorpayOptions = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: "INR",
      name: `Ganimi - ${serviceName}`,
      description: `Payment for ${serviceName}`,
      order_id: paymentData.orderId,
      callback_url: "http://localhost:5500/api/v1/payments/callback",
      theme: { color: "#3399cc" },
      handler: function (response) {
        console.log(response);
        
        // Verify payment
        fetch(`http://localhost:5500/api/v1/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            toast.success(successMessage);
            if (onSuccess) onSuccess(data, response);
          } else {
            toast.error(data.message);
            if (onError) onError(data);
          }
        })
        .catch((error) => {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
          if (onError) onError(error);
        });
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        }
      }
    };

    // Open Razorpay checkout
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();

  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error("Failed to initiate payment");
    if (onError) onError(error);
  }
};

/**
 * Initiates a Razorpay payment for category access (supports multiple categories)
 * @param {Object} paymentData - The payment data from API
 * @param {string} paymentData.key - Razorpay key
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.orderId - Order ID
 * @param {Array|string} categories - Array of category names or single category name
 * @param {Object} options - Additional options
 * @param {string} options.successMessage - Custom success message
 * @param {Function} options.onSuccess - Callback function on successful payment
 * @param {Function} options.onError - Callback function on payment error
 */
export const initiateCategoryPayment = async (paymentData, options = {}) => {
  const {
    successMessage = "Payment successful! You now have access to the selected categories.",
    onSuccess,
    onError
  } = options;

  try {
    // Load Razorpay script
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!loaded) {
      toast.error("Failed to load Razorpay script");
      return;
    }

    // Handle single category or multiple categories
    const categoryList = Array.isArray(paymentData.categories) ? paymentData.categories : [paymentData.categories];
    
    const description = categoryList.length === 1
      ? `Purchase access to ${categoryList[0]}`
      : `Purchase access to ${categoryList.join(', ')}`;

    // Configure Razorpay options
    const razorpayOptions = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: "INR",
      name: "Ganimi - Category Access",
      description: description,
      order_id: paymentData.orderId,
      callback_url: "http://localhost:5500/api/v1/payments/callback",
      theme: { color: "#3399cc" },
      handler: function (response) {
        console.log(response);
        
        fetch(`http://localhost:5500/api/v1/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            toast.success(successMessage);
            if (onSuccess) onSuccess(data, response);
          } else {
            toast.error(data.message);
            if (onError) onError(data);
          }
        })
        .catch((error) => {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
          if (onError) onError(error);
        });
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        }
      }
    };

    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();

  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error("Failed to initiate payment");
    if (onError) onError(error);
  }
};

/**
 * Generic Razorpay payment function for custom use cases
 * @param {Object} paymentData - The payment data from API
 * @param {string} paymentData.key - Razorpay key
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.orderId - Order ID
 * @param {string} name - Payment name/title
 * @param {string} description - Payment description
 * @param {Object} options - Additional options
 * @param {string} options.successMessage - Custom success message
 * @param {Function} options.onSuccess - Callback function on successful payment
 * @param {Function} options.onError - Callback function on payment error
 */
export const initiateCustomPayment = async (paymentData, name, description, options = {}) => {
  const {
    successMessage = "Payment successful",
    onSuccess,
    onError
  } = options;

  try {
    // Load Razorpay script
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!loaded) {
      toast.error("Failed to load Razorpay script");
      return;
    }

    // Configure Razorpay options
    const razorpayOptions = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: "INR",
      name: name,
      description: description,
      order_id: paymentData.orderId,
      callback_url: "http://localhost:5500/api/v1/payments/callback",
      theme: { color: "#3399cc" },
      handler: function (response) {
        console.log(response);
        
        // Verify payment
        fetch(`http://localhost:5500/api/v1/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            toast.success(successMessage);
            if (onSuccess) onSuccess(data, response);
          } else {
            toast.error(data.message);
            if (onError) onError(data);
          }
        })
        .catch((error) => {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
          if (onError) onError(error);
        });
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        }
      }
    };

    // Open Razorpay checkout
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();

  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error("Failed to initiate payment");
    if (onError) onError(error);
  }
};
