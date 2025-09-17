"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isButtonFloating, setIsButtonFloating] = useState(true);
  const submitButtonRef = useRef(null);
  const originalButtonPositionRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (originalButtonPositionRef.current && selectedCategories.length > 0) {
                const buttonRect = originalButtonPositionRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // If the original button position is visible on screen, make it static
                if (buttonRect.top <= windowHeight - 100) {
                    setIsButtonFloating(false);
                } else {
                    setIsButtonFloating(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [selectedCategories.length]);

    useEffect(() => {
        // Reset floating state when categories change
        if (selectedCategories.length === 0) {
            setIsButtonFloating(true);
        }
    }, [selectedCategories.length]);

    const fetchData = async () => {
        try{
            await fetch("http://localhost:5500/api/v1/student/categories", {
                credentials: "include",
            }).then(res => res.json()).then(data => {
                // Sort categories: subscribed (access !== null) first, then unsubscribed
                const sortedCategories = data.data.sort((a, b) => {
                    if (a.access !== null && b.access === null) return -1; // a has access, comes first
                    if (a.access === null && b.access !== null) return 1;  // b has access, comes first
                    return 0; // both have same access status, maintain original order
                });
                setCategories(sortedCategories);
            });
        }catch(error){
            console.error("Error fetching categories:", error);
        }
    }

    const handleCategorySelect = (categoryId, isChecked) => {
        if (isChecked) {
            setSelectedCategories(prev => [...prev, categoryId]);
        } else {
            setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        }
    };

    const handleSelectAllToggle = (checked) => {
        const availableCategories = categories.filter(category => category.access === null);
        const allAvailableIds = availableCategories.map(category => category.id);
        
        if (checked) {
            // Select all available categories
            setSelectedCategories(prev => {
                const newSelected = [...new Set([...prev, ...allAvailableIds])];
                return newSelected;
            });
        } else {
            // Deselect all available categories
            setSelectedCategories(prev => 
                prev.filter(id => !allAvailableIds.includes(id))
            );
        }
    };

    // Check if all available categories are selected
    const areAllAvailableSelected = () => {
        const availableCategories = categories.filter(category => category.access === null);
        const allAvailableIds = availableCategories.map(category => category.id);
        return allAvailableIds.length > 0 && allAvailableIds.every(id => selectedCategories.includes(id));
    };

    const handleIndividualSubscribe = async (categoryId) => {
        try {
            // Add your individual subscription logic here
            toast.success(`Subscribed to category successfully!`);
        } catch (error) {
            toast.error("Failed to subscribe to category");
            console.error("Subscription error:", error);
        }
    };

    const handleBrowserServices = async (categoryId) => {
        try {
            window.location.href = `/category/${categoryId}`;
            toast.success(`Browsed services successfully!`);
        } catch (error) {
            toast.error("Failed to browse services");
            console.error("Browsing error:", error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (selectedCategories.length === 0) {
            toast.error("Please select at least one category");
            return;
        }
        
        try {
            // Add your bulk subscription logic here
            toast.success(`Subscribed to ${selectedCategories.length} categories successfully!`);
            setSelectedCategories([]);
            fetchData(); // Refresh data
        } catch (error) {
            toast.error("Failed to subscribe to categories");
            console.error("Bulk subscription error:", error);
        }
    };

  return (
    <div className="p-10">
      <h1 className="text-lg mb-4">Browse Categories</h1>
      
      {/* Select All Checkbox */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={areAllAvailableSelected()}
            onCheckedChange={handleSelectAllToggle}
            disabled={categories.filter(category => category.access === null).length === 0}
            className="cursor-pointer"
          />
          <label 
            htmlFor="select-all" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Select All Available Categories
          </label>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            {categories.map((category) => (
              <Card key={category.id} className={ `gap-1 ${category.access !== null ? "bg-green-50 border-green-200" : ""}`}>
                <CardHeader>
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3">
                      {category.access === null && (
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategorySelect(category.id, checked)}
                          className="w-6 h-6"
                        />
                      )}
                      {category.name}
                      {category.access !== null && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Subscribed
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                    {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                  <p className="font-semibold text-lg">₹{category.price}</p>
                  {category.access === null && (
                    <Button 
                      type="button"
                      onClick={() => handleIndividualSubscribe(category.id)}
                      className="cursor-pointer hover:bg-primary/40"
                    >
                      Subscribe Now
                    </Button>
                  )}
                  {category.access !== null && (
                    <Button 
                      type="button"
                      onClick={() => handleBrowserServices(category.id)}
                      className="cursor-pointer hover:bg-primary/40"
                    >
                      Browser Services
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Original Button Position (placeholder when floating) */}
        <div ref={originalButtonPositionRef} className="flex justify-center">
          {selectedCategories.length > 0 && !isButtonFloating && (
            <Button 
              type="submit" 
              size="lg"
              className="px-8"
            >
              Subscribe to Selected Categories ({selectedCategories.length})
            </Button>
          )}
        </div>
      </form>

      {/* Floating Submit Button */}
      {selectedCategories.length > 0 && isButtonFloating && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button 
            type="submit" 
            size="lg"
            className="px-8 shadow-lg bg-primary hover:bg-primary/90"
            onClick={handleFormSubmit}
          >
            Subscribe to Selected Categories ({selectedCategories.length})
          </Button>
        </div>
      )}
    </div>
  );
}