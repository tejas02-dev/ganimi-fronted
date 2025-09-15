"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/custom/Navbar";
import { 
  Heart,
  Search, 
  Book, 
  Code, 
  Palette, 
  Music, 
  Calculator, 
  Globe, 
  Star,
  ArrowRight,
  Menu,
  GraduationCap,
  Package,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const categoryIcons = {
    "Tutoring": Book,
    "Programming": Code,
    "Design": Palette,
    "Music": Music,
    "Mathematics": Calculator,
    "Languages": Globe,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories and services in parallel
      const [categoriesResponse, servicesResponse] = await Promise.all([
        fetch("http://localhost:5500/api/v1/categories", {
          credentials: "include",
        }),
        fetch("http://localhost:5500/api/v1/services", {
          credentials: "include",
        }),
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(Array.isArray(categoriesData.data) ? categoriesData.data : []);
      } else {
        console.warn("Failed to fetch categories:", categoriesResponse.status);
        setCategories([]);
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(Array.isArray(servicesData.data) ? servicesData.data : []);
      } else {
        console.warn("Failed to fetch services:", servicesResponse.status);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCategories([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

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
  }

  const handleBookNow = async (serviceId, serviceName) => {
    const response = await fetch(`http://localhost:5500/api/v1/orders/service/${serviceId}`, {
      credentials: "include",
      method: "POST",
    });
    const data = await response.json();
    if (data.status === "error") {
      toast.error(data.message);
      return;
    }

    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if(!loaded) {
      toast.error("Failed to load Razorpay script");
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Ganimi" + " - " + serviceName,
      description: "Payment for " + serviceName,
      order_id: data.orderId,
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
        }).then((res)=>res.json()).then((data)=>{
          if(data.status === "ok") {
            toast.success("Payment successful");
          }
          else {
            toast.error(data.message);
          }
        })
        
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/category/${categoryId}`);
  };

  const featuredServices = Array.isArray(services) ? services.slice(0, 8) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        showSearch={true}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeInUp">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              Trusted by 10,000+ students worldwide
            </div>

            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Find the Perfect
              <br />
              <span className="text-5xl md:text-8xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Service Provider
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              Connect with expert tutors, developers, designers, and more. 
              <span className="block mt-2 text-lg opacity-75">Start your learning journey today!</span>
            </p>

            {/* Popular Categories Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              {['Math Tutoring', 'Web Development', 'Graphic Design', 'Music Lessons'].map((category, index) => (
                <span 
                  key={category}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200 cursor-pointer transform hover:scale-105"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 group-focus-within:text-blue-600 transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="What service are you looking for?"
                  className="pl-12 pr-32 py-5 text-lg w-full text-gray-900 placeholder:text-gray-500 bg-white/95 backdrop-blur-sm border-white/20 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  Search
                </Button>
              </div>
              
              {/* Search Suggestions */}
              <div className="mt-4 text-sm opacity-75">
                Popular: 
                <button className="ml-2 underline hover:text-yellow-300 transition-colors">Python Programming</button>, 
                <button className="ml-1 underline hover:text-yellow-300 transition-colors">IELTS Preparation</button>, 
                <button className="ml-1 underline hover:text-yellow-300 transition-colors">Logo Design</button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fadeInUp" style={{ animationDelay: '1s' }}>
              {[
                { number: '10K+', label: 'Students' },
                { number: '500+', label: 'Expert Providers' },
                { number: '50+', label: 'Categories' },
                { number: '4.9', label: 'Average Rating' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-200">
                    {stat.number}
                  </div>
                  <div className="text-sm opacity-75 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          ) : !Array.isArray(categories) || categories.length === 0 ? (
            // Empty state when no categories available
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Book className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
              <p className="text-gray-600 text-center max-w-sm mb-4">
                Categories are being set up. Please check back later.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                Refresh Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.isArray(categories) && categories.slice(0, 8).map((category) => {
                const Icon = categoryIcons[category.name] || Book;
                return (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-0 shadow-md hover:shadow-blue-100 bg-gradient-to-br from-white to-blue-50/30"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
            <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 group">
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          ) : featuredServices.length === 0 ? (
            // Empty state when no services available
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Package className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Featured Services Yet</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                We're working hard to bring you amazing service providers. Check back soon or explore our categories to discover available services.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/categories">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Browse Categories
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors">
                    View All Services
                  </Button>
                </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="mt-8 flex space-x-4 opacity-30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-gray-100 shadow-md overflow-hidden bg-white rounded-2xl p-0 gap-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="py-3 bg-gradient-to-r from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 ring-2 ring-white shadow-md group-hover:scale-110 transition-transform duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {service.name?.charAt(0).toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{service.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} group-hover:scale-110 transition-transform duration-300`}
                              style={{ transitionDelay: `${i * 50}ms` }}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">4.8 (127)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description || "Professional service provider with years of experience helping students achieve their goals."}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                          {service.price || "50"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-gray-500">Starting from</span>
                        <span className="block text-sm font-medium text-gray-700">Next available</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl" onClick={() => handleBookNow(service.id, service.name)}>
                        Book Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-xl"
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
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning with expert providers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-3">
                Get Started Now
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="text-white border-2 border-white/50 hover:bg-white hover:text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 backdrop-blur-sm bg-white/10">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Ganimi</span>
              </div>
              <p className="text-gray-600">
                Connecting students with expert service providers for better learning outcomes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/categories" className="hover:text-blue-600">Browse Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-blue-600">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Providers</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/become-provider" className="hover:text-blue-600">Become a Provider</Link></li>
                <li><Link href="/provider-resources" className="hover:text-blue-600">Resources</Link></li>
                <li><Link href="/provider-support" className="hover:text-blue-600">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Ganimi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}