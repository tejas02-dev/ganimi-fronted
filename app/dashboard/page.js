"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/custom/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Package,
  Calendar,
  CreditCard,
  Heart,
  Plus,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [activeSection, setActiveSection] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch user profile and stats
      await Promise.all([
        fetchUserProfile(),
        fetchUserStats(parsedUser.role)
      ]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/v1/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({ ...prev, ...data.user }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserStats = async (role) => {
    try {
      const endpoint = role === "vendor" 
        ? "http://localhost:5500/api/v1/vendor/stats"
        : "http://localhost:5500/api/v1/student/stats";
      
      const response = await fetch(endpoint, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar showSearch={false} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Student navigation items
  const studentNavItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  // Vendor navigation items
  const vendorNavItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "services", label: "My Services", icon: Package },
    { id: "create-service", label: "Create Service", icon: Plus },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: Star },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  const StudentDashboard = () => (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 pr-6">
        <div className="space-y-2">
          <div className="pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-600">Navigate your account</p>
          </div>
          <nav className="space-y-1">
            {studentNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 pl-6">
        {renderStudentContent()}
      </div>
    </div>
  );

  const VendorDashboard = () => (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 pr-6">
        <div className="space-y-2">
          <div className="pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Business</h2>
            <p className="text-sm text-gray-600">Manage your services</p>
          </div>
          <nav className="space-y-1">
            {vendorNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 pl-6">
        {renderVendorContent()}
      </div>
    </div>
  );

  const renderStudentContent = () => {
    switch (activeSection) {
      case "overview":
        return <StudentOverview />;
      case "orders":
        return <OrdersSection />;
      case "bookings":
        return <BookingsSection />;
      case "billing":
        return <BillingSection />;
      case "favorites":
        return <FavoritesSection />;
      case "profile":
        return <ProfileSettings user={user} onUpdate={setUser} />;
      default:
        return <StudentOverview />;
    }
  };

  const renderVendorContent = () => {
    switch (activeSection) {
      case "overview":
        return <VendorOverview stats={stats} />;
      case "services":
        return <ServicesSection />;
      case "create-service":
        return <CreateServiceSection />;
      case "bookings":
        return <VendorBookingsSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "profile":
        return <ProfileSettings user={user} onUpdate={setUser} />;
      default:
        return <VendorOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 ring-4 ring-blue-100">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-600 text-white text-xl font-semibold">
                  {user.name?.charAt(0).toUpperCase() }
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.name || "User"}!
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge 
                    variant={user.role === 'vendor' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                  {user.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {user.role === 'student' ? <StudentDashboard /> : <VendorDashboard />}
        </div>
      </div>
    </div>
  );
}

// Student Content Components
function StudentOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your Dashboard</h2>
        <p className="text-gray-600">Manage your orders, bookings, and account settings from here.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent orders and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm">Your recent orders and bookings will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your recent and past orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Your orders will appear here once you make a purchase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BookingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h2>
        <p className="text-gray-600">View and manage your service bookings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your scheduled services and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm">Your bookings will appear here when you schedule services</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
        <p className="text-gray-600">Manage your payment methods and billing history</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your transaction history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No payment history</p>
            <p className="text-sm">Your payment history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FavoritesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Favorites</h2>
        <p className="text-gray-600">Your saved services and providers</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Saved Services</CardTitle>
          <CardDescription>Services you've marked as favorites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm">Save services you like to find them easily later</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Vendor Content Components
function VendorOverview({ stats }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Overview</h2>
        <p className="text-gray-600">Track your business performance and metrics</p>
      </div>
      
      {/* Vendor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices || 0}</div>
            <p className="text-xs text-muted-foreground">Services created</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings || 0}</div>
            <p className="text-xs text-muted-foreground">Current bookings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings || 0}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating || "0.0"}</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest business activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Recent activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServicesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Services</h2>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>All your published services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No services created yet</p>
            <p className="text-sm">Create your first service to start receiving bookings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateServiceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Service</h2>
        <p className="text-gray-600">Add a new service to your offerings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Fill in the details for your new service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Service creation form coming soon</p>
            <p className="text-sm">This feature will be available in the next update</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VendorBookingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Bookings</h2>
        <p className="text-gray-600">Manage your customer bookings and appointments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Customer appointments and scheduled services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No bookings yet</p>
            <p className="text-sm">Customer bookings will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Track your business performance</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
          <CardDescription>Performance metrics and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Analytics dashboard coming soon</p>
            <p className="text-sm">Detailed analytics will be available here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    pincode: user.pincode || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5500/api/v1/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(prev => ({ ...prev, ...formData }));
        
        // Update localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...formData }));
        }
        
        setMessage("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your pincode"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your full address"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Business Settings Component (for vendors)
function BusinessSettings({ user, stats }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>Your business performance and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalServices || 0}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalBookings || 0}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">${stats.totalEarnings || 0}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest business activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Recent activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
