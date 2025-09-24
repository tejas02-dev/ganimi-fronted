"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/custom/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import DatePicker from "@/components/custom/DatePicker";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext";

export default function StudentProfile() {
  const router = useRouter();
  const { user: authUser, updateUserField } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileImageMessage, setProfileImageMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [parentMessage, setParentMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileImageFormData, setProfileImageFormData] = useState({
    profilePicture: "",
  });

  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    pincode: "",
    dateOfBirth: "",
    school: "",
    grade: "",
  });

  const [parentFormData, setParentFormData] = useState({
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    fatherEmail: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",
    motherEmail: "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    updateFormData();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/user");
      console.log("Profile response:", response.data);
      
      if (response.status === 200) {
        const userData = response.data.data;
        console.log("User data:", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = async () => {
    // Check if user data exists before trying to access properties
    if (!user) {
      console.log("User data not available yet");
      return;
    }

    console.log(user);
    // Format date from database to YYYY-MM-DD string for DatePicker
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return "";
      try {
        const date = new Date(dateValue);
        // Fix timezone issue by using local date parts
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error("Date formatting error:", error);
        return "";
      }
    };

    setProfileFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      address: user.address || "",
      pincode: user.pincode || "",
      dateOfBirth: formatDateForInput(user.dob) || "",
      school: user.school || "",
      grade: user.grade || "",
    });

    setParentFormData({
      fatherName: user.fatherName || "",
      fatherOccupation: user.fatherOccupation || "",
      fatherPhone: user.fatherPhone || "",
      fatherEmail: user.fatherEmail || "",
      motherName: user.motherName || "",
      motherOccupation: user.motherOccupation || "",
      motherPhone: user.motherPhone || "",
      motherEmail: user.motherEmail || "",
    });

  };

  const UpdateProfileImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileImageMessage("");

    if (!profileImageFormData.profilePicture) {
      setProfileImageMessage("Please select a profile picture");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePicture', profileImageFormData.profilePicture);

      const response = await api.put("/auth/update-profile-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Profile image update response:", response.data);
      const data = response.data;

      if (response.status === 200) {
        toast.success(data.message || "Profile image updated successfully!");
        setProfileImageMessage("Profile image updated successfully!");
        
        // Update user state with new profile picture URL
        // Check different possible response structures
        const newProfilePicture = data.data?.profilePicture || data.profilePicture || data.data?.user?.profilePicture;
        console.log("New profile picture URL:", newProfilePicture);
        
        if (newProfilePicture) {
          // Update local user state
          setUser(prev => ({ ...prev, profilePicture: newProfilePicture }));
          
          // Update global AuthContext user state - only the profilePicture field
          updateUserField('profilePicture', newProfilePicture);
        } else {
          // If no profile picture in response, refresh the profile data
          console.log("No profile picture in response, refreshing profile...");
          await fetchUserProfile();
        }

      } else {
        setProfileImageMessage(data.message || "Failed to update profile image");
      }
    } catch (error) {
      setProfileImageMessage("An error occurred while updating profile image");
    } finally {
      setLoading(false);
    }
  };

  const UpdateProfileData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMessage("");

    try {
      const response = await api.put("/auth/update-student-profile", profileFormData);
      console.log("Profile update response:", response.data);
      const data = response.data;
      if (response.status === 200) {
        setUser(prev => ({ ...prev, ...profileFormData }));
        toast.success(data.message || "Profile updated successfully!");
        setProfileMessage("Profile updated successfully!");
      } else {
        const errorData = data;
        setProfileMessage(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      setProfileMessage("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const UpdateParentData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setParentMessage("");

    try {
      const response = await api.put("/auth/update-guardian-profile", parentFormData);
        console.log("Parent update response:", response.data);
        const data = response.data;
        if (response.status === 200) {
          setUser(prev => ({ ...prev, ...parentFormData }));
          toast.success(data.message || "Parent updated successfully!");
          setParentMessage("Parent updated successfully!");
        } else {
          const errorData = data;
          setParentMessage(errorData.message || "Failed to update parent");
        }
      } catch (error) {
        setParentMessage("An error occurred while updating parent");
      } finally {
        setLoading(false);
      }
  };

  const UpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMessage("");

    try {
      const response = await api.put("/auth/update-password", passwordFormData);
        console.log("Password update response:", response.data);
        const data = response.data;
        if (response.status === 200) {
          toast.success(data.message || "Password updated successfully!");
          setPasswordMessage("Password updated successfully!");
        } else {
          const errorData = data;
          setPasswordMessage(errorData.message || "Failed to update password");
        }
      } catch (error) {
        setPasswordMessage("An error occurred while updating password");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="p-10">
      <div>
        <h1 className="text-lg mb-2">Update your profile picture and personal information</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
          <div className="space-y-6">
            <form onSubmit={UpdateProfileImage}>
              <Card className="flex flex-col p-8 items-start gap-4">
                <img src={user?.profilePicture || "/default-profile.png"} alt="Profile" width={150} height={150} className="rounded-[50px] object-cover border" />


                <div>
                  <CardTitle className="text-lg font-bold">Profile Picture</CardTitle>
                  <CardDescription className="text-sm text-gray-500">This will be displayed on your profile page</CardDescription>
                </div>

                <div className="flex gap-4">

                  <label className="bg-primary px-4 py-1 cursor-pointer border rounded-lg bg-primary/10">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setProfileImageFormData(prev => ({ ...prev, profilePicture: file }));
                      }}
                    />
                    <span className="text-xs">Upload New</span>
                  </label>

                  <Button type="submit" disabled={loading}>Save</Button>
                </div>
              </Card>
            </form>

            <form onSubmit={UpdateProfileData}>
              <Card className="flex flex-col p-8 items-start gap-4">
                <div>
                  <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Update your personal information</CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileFormData.name || ""}
                      onChange={e => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      disabled
                      type="text"
                      className="input input-bordered w-full"
                      value={profileFormData.email}
                      onChange={e => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      type="number"
                      className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                      value={profileFormData.phone || ""}
                      onChange={e => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <Select onValueChange={e => setProfileFormData(prev => ({ ...prev, gender: e }))} value={profileFormData.gender || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileFormData.address}
                      onChange={e => setProfileFormData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pincode</label>
                    <Input
                      type="number"
                      className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                      value={profileFormData.pincode}
                      onChange={e => setProfileFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <DatePicker
                      label="Date of Birth"
                      placeholder="Select your date of birth"
                      value={profileFormData.dateOfBirth || ""}
                      onChange={(date) => {
                        console.log("Date selected:", date);
                        if (date) {
                          // Fix timezone issue by using local date
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const formattedDate = `${year}-${month}-${day}`;
                          console.log("Formatted date:", formattedDate);

                          setProfileFormData(prev => ({
                            ...prev,
                            dateOfBirth: formattedDate
                          }));
                        } else {
                          setProfileFormData(prev => ({
                            ...prev,
                            dateOfBirth: ""
                          }));
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">School</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileFormData.school}
                      onChange={e => setProfileFormData(prev => ({ ...prev, school: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileFormData.grade}
                      onChange={e => setProfileFormData(prev => ({ ...prev, grade: e.target.value }))}
                      required
                    />
                  </div>

                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                {profileMessage && (
                  <div className="text-sm text-center text-green-600 mt-2">{profileMessage}</div>
                )}
              </Card>
            </form>
          </div>

          <div className="space-y-6">
            <form onSubmit={UpdateParentData}>
              <Card className="flex flex-col p-8 items-start gap-4">
                <div>
                  <CardTitle className="text-lg font-bold">Parent Information</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Update your parent information</CardDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Father's Name</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={parentFormData.fatherName}
                      onChange={e => setParentFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Father's Occupation</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={parentFormData.fatherOccupation}
                      onChange={e => setParentFormData(prev => ({ ...prev, fatherOccupation: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Father's Email</label>
                    <Input
                      type="email"
                      className="input input-bordered w-full"
                      value={parentFormData.fatherEmail}
                      onChange={e => setParentFormData(prev => ({ ...prev, fatherEmail: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Father's Phone</label>
                    <Input
                      type="number"
                      className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                      value={parentFormData.fatherPhone}
                      onChange={e => setParentFormData(prev => ({ ...prev, fatherPhone: e.target.value }))}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mother's Name</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={parentFormData.motherName}
                      onChange={e => setParentFormData(prev => ({ ...prev, motherName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mother's Occupation</label>
                    <Input
                      type="text"
                      className="input input-bordered w-full"
                      value={parentFormData.motherOccupation}
                      onChange={e => setParentFormData(prev => ({ ...prev, motherOccupation: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mother's Email</label>
                    <Input
                      type="email"
                      className="input input-bordered w-full"
                      value={parentFormData.motherEmail}
                      onChange={e => setParentFormData(prev => ({ ...prev, motherEmail: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mother's Phone</label>
                    <Input
                      type="number"
                      className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                      value={parentFormData.motherPhone}
                      onChange={e => setParentFormData(prev => ({ ...prev, motherPhone: e.target.value }))}
                    />
                  </div>

                </div>
                <Button type="submit" disabled={loading}>Save</Button>
                {parentMessage && (
                  <div className="text-sm text-center text-green-600 mt-2">{parentMessage}</div>
                )}
              </Card>
            </form>

            <form onSubmit={UpdatePassword}>
              <Card className="flex flex-col p-8 items-start gap-4">
                <div>
                  <CardTitle className="text-lg font-bold">Update Password</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Update your password</CardDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Old Password</label>
                    <Input type="password" className="input input-bordered w-full" value={passwordFormData.oldPassword} onChange={e => setPasswordFormData(prev => ({ ...prev, oldPassword: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input type="password" className="input input-bordered w-full" value={passwordFormData.newPassword} onChange={e => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>Save</Button>
                {passwordMessage && (
                  <div className="text-sm text-center text-green-600 mt-2">{passwordMessage}</div>
                )}
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}