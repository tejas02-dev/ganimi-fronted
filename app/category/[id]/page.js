"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  Package,
  DollarSign,
  Clock,
  Users
} from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id;
  
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchCategoryData();
  }, [categoryId]);

  useEffect(() => {
    applyFilters();
  }, [services, searchQuery, locationFilter, priceRange, ratingFilter, availabilityFilter, sortBy]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      
      // Fetch category info and services in parallel
      const [categoryResponse, servicesResponse] = await Promise.all([
        fetch(`http://localhost:5500/api/v1/admin/categories/${categoryId}`, {
          credentials: "include",
        }),
        fetch(`http://localhost:5500/api/v1/admin/services/categories/${categoryId}`, {
          credentials: "include",
        }),
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategory(categoryData.category?.[0] || null);
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
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

  const applyFilters = () => {
    let filtered = [...services];

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

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setPriceRange([0, 1000]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <GraduationCap className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  Ganimi
                </span>
              </Link>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span className="text-gray-900 font-medium">{category?.name || 'Category'}</span>
            </div>

            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {category?.name || 'Category'} Services
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {category?.description || 'Discover amazing services in this category'}
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

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <DollarSign className="w-4 h-4 mr-1" />
                    Price Range (per hour)
                  </label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
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
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Services Grid */}
          <div className="flex-1">
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
                    className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border-0 shadow-md overflow-hidden bg-gradient-to-br from-white to-gray-50/50"
                  >
                    <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md group-hover:scale-110 transition-transform duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            {service.name?.charAt(0).toUpperCase() || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {service.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">4.8 (127)</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/50"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description || "Professional service provider with years of experience."}
                      </CardDescription>
                      
                      {service.address && (
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">{service.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                            ${service.price || "50"}
                          </span>
                          <span className="text-xs text-gray-500">per hour</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">Available</span>
                          <span className="text-sm font-medium text-green-600">Today</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Book Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
