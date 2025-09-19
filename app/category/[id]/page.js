"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { 
  Search, 
  Filter,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  Package,
  DollarSign,
  IndianRupee,
  Clock,
  Users,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import { initiateCategoryPayment } from "@/lib/razorpay";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;
  
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(null);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    checkAccess();
  }, [categoryId]);

  const handlePurchaseCategory = async () => {
    try {
      // Make API call to create order
      const response = await fetch(`http://localhost:5500/api/v1/orders/category/${categoryId}`, {
        credentials: "include",
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      // Use utility function with payment data
      await initiateCategoryPayment(data, category?.name, {
        successMessage: "Payment successful! You now have access to this category.",
        onSuccess: (data, response) => {
          console.log("Category access payment completed:", data);
          // Refresh the page to show the category content
          window.location.reload();
        },
        onError: (error) => {
          console.error("Category payment failed:", error);
        }
      });
    } catch (error) {
      console.error("Error creating category order:", error);
      toast.error("Failed to initiate payment");
    }
  };

  const checkAccess = async () => {
    try {
      const response = await fetch(`http://localhost:5500/api/v1/student/category/${categoryId}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasAccess(data.access);
        
        if (data.access) {
          // If user has access, fetch category data
          fetchCategoryData();
        } else {
          // If no access, fetch basic category info and show dialog
          fetchBasicCategoryInfo();
          setShowAccessDialog(true);
          setLoading(false);
        }
      } else {
        // If API call fails, assume no access for security
        setHasAccess(false);
        fetchBasicCategoryInfo();
        setShowAccessDialog(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking access:", error);
      // If error occurs, assume no access for security
      setHasAccess(false);
      fetchBasicCategoryInfo();
      setShowAccessDialog(true);
      setLoading(false);
    }
  };

  const fetchBasicCategoryInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5500/api/v1/categories/${categoryId}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {
      console.error("Error fetching basic category info:", error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [services, searchQuery, locationFilter, priceRange, ratingFilter, availabilityFilter, sortBy]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data for category ID:", categoryId);
      
      // Fetch category info and services in parallel
      const [categoryResponse, servicesResponse] = await Promise.all([
        fetch(`http://localhost:5500/api/v1/categories/${categoryId}`, {
          credentials: "include",
        }),
        fetch(`http://localhost:5500/api/v1/services/category/${categoryId}`, {
          credentials: "include",
        }),
      ]);

      console.log("Category response:", categoryResponse);
      console.log("Services response:", servicesResponse);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        console.log("Category data:", categoryData); // Debug log
        // Handle different possible response structures
        const categoryInfo = categoryData.data?.[0] || categoryData.category?.[0] || categoryData.data || categoryData;
        console.log("Processed category:", categoryInfo); // Debug the actual category object
        setCategory(categoryInfo);
      } else {
        console.error("Failed to fetch category:", categoryResponse.status, categoryResponse.statusText);
        // Set a fallback category with the ID
        setCategory({ 
          name: `Category ${categoryId}`, 
          description: 'Discover amazing services in this category' 
        });
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        console.log("Services data:", servicesData); // Debug log
        setServices(Array.isArray(servicesData.services) ? servicesData.services : []);
      } else {
        console.warn("Failed to fetch services:", servicesResponse.status);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Services:", services);
  const applyFilters = () => {
    let filtered = [...services];
    console.log("Filtered:", filtered);
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(service =>
        service.address?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        service.pincode?.includes(locationFilter)
      );
    }

    // Price range filter
    filtered = filtered.filter(service => {
      const price = parseFloat(service.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(service => {
        const rating = 4.8; // Mock rating since it's not in the API
        return rating >= ratingFilter;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'rating':
          return 4.8 - 4.8; // Mock rating comparison
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  };

  console.log("Filtered Services:", filteredServices);

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setPriceRange([0, 100000]);
    setRatingFilter(0);
    setAvailabilityFilter("");
    setSortBy("relevance");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header placeholder */}
        <div className="h-16 bg-white border-b animate-pulse"></div>
        
        {/* Content placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar skeleton */}
            <div className="w-80 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="flex-1">
              <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have access, show access denied content
  if (hasAccess === false) {
    return (
      <div className="min-h-screen">
        <Navbar 
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          showSearch={true}
        />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center max-w-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {category?.name ? `${category.name} Category` : 'Category Access Required'}
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              You need to purchase access to view the services in this category. 
              {category?.description && (
                <span className="block mt-2 text-sm text-gray-500">
                  {category.description}
                </span>
              )}
            </p>
            {category?.price && (
              <div className="mb-4">
                <span className="text-lg font-semibold text-blue-700">
                  Price: ₹{category.price}
                </span>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Get Full Access</h3>
                  <p className="text-sm text-gray-600">Unlock all services in this category</p>
                </div>
              </div>
              
              <Button 
                onClick={handlePurchaseCategory}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Purchase Category Access
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Explore Other Categories
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="w-full text-gray-500 hover:text-gray-700"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        showSearch={true}
      />

      {/* Content with proper spacing for navbar */}
      <div className=""> {/* Add top padding to account for fixed navbar */}

        {/* Sidebar and Content */}
        <SidebarProvider>
          <div className="flex w-full min-h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <Sidebar className="fixed top-[65px] left-0 h-full">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto p-1"
                  >
                    Reset
                  </Button>
                </SidebarGroupLabel>
                <SidebarGroupContent className="space-y-6 p-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search Services</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </label>
                    <Input
                      placeholder="Enter city, area, or pincode..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      Price Range
                    </label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center" ><IndianRupee className="w-4 h-4" />{priceRange[0]}</span>
                      <span className="flex items-center" ><IndianRupee className="w-4 h-4" />{priceRange[1]}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Minimum Rating
                    </label>
                    <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.8">4.8+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Availability */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Availability
                    </label>
                    <Select value={availabilityFilter || "any"} onValueChange={(value) => setAvailabilityFilter(value === "any" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any time</SelectItem>
                        <SelectItem value="today">Available today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="weekend">Weekends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <SidebarInset className="overflow-hidden">
            <div className="flex-1 px-2 sm:px-6 lg:px-8 py-4 overflow-y-auto max-h-[calc(100vh-8rem)] w-full">
            {/* Category Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {category?.category?.name || category?.name || `Category ${categoryId}`}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {category?.category?.description || category?.description || 'Discover amazing services in this category'}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {services.length > 0 ? `${Math.floor(services.length * 1.5)}+ providers` : 'No providers yet'}
                </span>
              </div>
            </div>

            {/* Services Grid */}
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Showing {filteredServices.length} of {services.length} results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  {services.length === 0 
                    ? "No services are available in this category yet. Check back soon!"
                    : "No services match your current filters. Try adjusting your search criteria."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Clear Filters
                  </Button>
                  <Link href="/categories">
                    <Button variant="outline">
                      Browse Other Categories
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                          {service.name?.charAt(0).toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">4.8 (127)</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 line-clamp-2">
                        {service.description || "Professional service provider with years of experience."}
                      </CardDescription>
                      
                      {service.address && (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">{service.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-green-600 flex items-center">
                            <IndianRupee className="w-4 h-4" />{service.price || "50"}
                          </span>
                          <span className="text-xs text-muted-foreground">per hour</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">Available</span>
                          <span className="text-sm font-medium text-green-600">Today</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          Book Now
                        </Button>
                        <Button variant="outline" size="icon">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
