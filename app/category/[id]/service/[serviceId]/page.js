"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/custom/Navbar";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Clock,
  Users,
  IndianRupee,
  Phone,
  Mail,
  Calendar,
  ShoppingCart,
  Share2,
  Check,
  ChevronRight,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";
import { initiateServicePayment } from "@/lib/razorpay";
import api from "@/lib/api";

export default function ServicePage({ params }) {
  const router = useRouter();
  const allParams = useParams();
  const categoryId = allParams.id; // Category ID from the first [id]
  const serviceId = allParams.serviceId; // Service ID from the nested [id]
  
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchServiceData();
  }, [serviceId, categoryId]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      console.log("Fetching service data:", { categoryId, serviceId });
      
      // Fetch service details and category info in parallel
      const [serviceResponse, categoryResponse] = await Promise.all([
        api.get(`/services/${serviceId}`),
        api.get(`/categories/${categoryId}`),
      ]);

      if (serviceResponse.status === 200) {
        const serviceData = await serviceResponse.data;
        console.log("Service data:", serviceData);
        const serviceInfo = serviceData.data || serviceData;
        setService(serviceInfo);
        // Auto-select first batch if available
        if (serviceInfo.batches && serviceInfo.batches.length > 0) {
          setSelectedBatch(serviceInfo.batches[0]);
        }
      } else {
        console.error("Failed to fetch service:", serviceResponse.status);
        toast.error("Service not found");
      }

      if (categoryResponse.status === 200) {
        const categoryData = await categoryResponse.data;
        console.log("Category data:", categoryData);
        setCategory(categoryData.category || categoryData);
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
      toast.error("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!selectedBatch) {
      toast.error("Please select a batch first!");
      return;
    }
    
    try{
      const response = await api.post(`/orders/service/${serviceId}`, {
        batchId: selectedBatch.id,
      });
      
      const data = await response.data;
      await initiateServicePayment(data, service.name, selectedBatch.name, {
        successMessage: "Service booked successfully!",
        onSuccess: () => {
          toast.success(`Service booked successfully!`);
          router.push(`/dashboard/student/services`);
        },
      });
    } catch (error) {
      console.error("Error booking service:", error);
      toast.error("Failed to book service");
    }

  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.name || "Service",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showSearch={false} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showSearch={false} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
            <div className="space-x-4">
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
              <Link href={`/category/${categoryId}`}>
                <Button>Browse Category</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${categoryId}`}>
                {category?.name || "Category"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{service.name}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Service Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{service.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.8 (127 reviews)</span>
                    </div>
                    <div className="text-sm text-gray-500">•</div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Available
                    </Badge>
                  </div>
                  {service.address && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{service.address}, {service.pincode}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="icon" onClick={handleBookmark}>
                    <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Vendor Info */}
              <Card className="mb-6">
                <CardContent className="">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {service.vendorName?.charAt(0).toUpperCase() || "V"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.vendorName}</h3>
                      <p className="text-sm text-gray-600">{service.vendorEmail}</p>
                      {service.vendorPhone && (
                        <p className="text-sm text-gray-600">{service.vendorPhone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Batch Selection - Amazon Style */}
            {service.batches && service.batches.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Choose Your Batch</CardTitle>
                  <CardDescription>
                    Select from {service.batches.length} available batch{service.batches.length > 1 ? 'es' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.batches.map((batch) => (
                      <div
                        key={batch.id}
                        onClick={() => handleBatchSelect(batch.id)}
                        className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                          ${selectedBatch?.id === batch.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        {selectedBatch?.id === batch.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{batch.name}</h3>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600 flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {batch.price}
                              </div>
                              <div className="text-xs text-gray-500">per batch</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <CalendarDays className="w-4 h-4 mr-2" />
                              <span>{batch.daysOfWeek}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{batch.startTime} - {batch.endTime}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              <span>Age Group: {batch.ageGroup}+ • Capacity: {batch.capacity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {service.description || "Professional service provider with years of experience delivering quality results. Our team is dedicated to providing exceptional service and ensuring customer satisfaction."}
                </p>
              </CardContent>
            </Card>

            {/* Service Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Professional instruction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>Highly rated provider</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-orange-600" />
                    </div>
                    <span>Direct communication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-2">
            {/* Pricing & Booking Card */}
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Selected Batch Summary */}
                  {selectedBatch ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Selected Batch</h3>
                      <div className="space-y-1">
                        <p className="font-medium">{selectedBatch.name}</p>
                        <p className="text-sm text-blue-700">{selectedBatch.daysOfWeek}</p>
                        <p className="text-sm text-blue-700">{selectedBatch.startTime} - {selectedBatch.endTime}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-blue-700">Batch Price:</span>
                          <span className="text-xl font-bold text-green-600 flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            {selectedBatch.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-gray-600">Please select a batch to continue</p>
                    </div>
                  )}

                  <Separator />

                  {/* Service Base Price */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Service Base Price:</span>
                      <span className="text-lg font-semibold flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {service.price}
                      </span>
                    </div>
                    {selectedBatch && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Batch Price:</span>
                        <span className="text-lg font-semibold flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {selectedBatch.price}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                      onClick={handleBookNow}
                      disabled={!selectedBatch}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {selectedBatch ? `Book ${selectedBatch.name}` : 'Select a Batch'}
                    </Button>
                    <Button variant="outline" className="w-full" disabled={!selectedBatch}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>

                  <Separator />

                  {/* Additional Info */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span>Free cancellation up to 24h</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span>Professional instructor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
