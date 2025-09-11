"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function EditServiceDialog({ service, onServiceUpdated, children }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    address: "",
    pincode: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when service prop changes
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        categoryId: service.categoryId || "",
        address: service.address || "",
        pincode: service.pincode || "",
        price: service.price?.toString() || "",
      });
    }
  }, [service]);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open && categories.length === 0) {
      fetchCategories();
    }
  }, [open, categories.length]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch("http://localhost:5500/api/v1/categories", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error("Failed to fetch categories");
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !service?.id) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5500/api/v1/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          categoryId: formData.categoryId,
          address: formData.address.trim(),
          pincode: formData.pincode.trim(),
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        toast.success("Service updated successfully!");
        setOpen(false);
        
        // Notify parent component
        if (onServiceUpdated) {
          onServiceUpdated();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Error updating service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        categoryId: service.categoryId || "",
        address: service.address || "",
        pincode: service.pincode || "",
        price: service.price?.toString() || "",
      });
    }
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Service</DialogTitle>
          <DialogDescription>
            Update the details of your service offering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Service Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
            >
              <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    No categories available
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.categoryId}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your service..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              placeholder="Enter service address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.address}
              </div>
            )}
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <label htmlFor="pincode" className="text-sm font-medium">
              Pincode <span className="text-red-500">*</span>
            </label>
            <Input
              id="pincode"
              placeholder="Enter 6-digit pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              maxLength={6}
              className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.pincode}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.price}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Service
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
