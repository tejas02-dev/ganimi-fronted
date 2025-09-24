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
import { useAuth } from "@/context/AuthContext";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function StudentProfile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const { user: authUser, updateUserField } = useAuth();
    const [loading, setLoading] = useState(false);

    const [profileImageMessage, setProfileImageMessage] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [institutionMessage, setInstitutionMessage] = useState("");
    const [bankMessage, setBankMessage] = useState("");
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
        qualification: "",
        experience: "",
        aadharNumber: "",
        panNumber: "",
    });

    const [institutionFormData, setInstitutionFormData] = useState({
        institutionName: "",
        institutionAddress: "",
        institutionPincode: "",
        institutionPhone: "",
        institutionEmail: "",
    });

    const [bankFormData, setBankFormData] = useState({
        bankName: "",
        bankAccountNumber: "",
        bankAccountHolderName: "",
        bankIfscCode: "",
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
            const response = await api.get("/auth/user");
            const data = response.data;
            setUser(data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
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
            qualification: user.qualification || "",
            experience: user.experience || "",
            aadharNumber: user.aadharNumber || "",
            panNumber: user.panNumber || "",
        });

        setInstitutionFormData({
            institutionName: user.businessName || "",
            institutionAddress: user.businessAddress || "",
            institutionPincode: user.businessPincode || "",
            institutionPhone: user.businessPhone || "",
            institutionEmail: user.businessEmail || "",
        });

        setBankFormData({
            bankName: user.bankName || "",
            bankAccountNumber: user.bankAccountNumber || "",
            bankAccountHolderName: user.bankAccountHolderName || "",
            bankIfscCode: user.bankIfscCode || "",
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

            const response = await api.put("/auth/update-profile-image", formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const data = response.data;

            if (response.status === 200) {
                toast.success(data.message || "Profile image updated successfully!");
                setProfileImageMessage("Profile image updated successfully!");
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
            const response = await api.put("/auth/update-vendor-profile", profileFormData)
            const data = response.data; 
            if (response.status === 200) {
                setProfileFormData(prev => ({ ...prev, ...profileFormData }));
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

    const UpdateInstitutionData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setInstitutionMessage("");

        try {
            const response = await api.put("/auth/update-institution-profile", institutionFormData)
            const data = response.data;
            if (response.status === 200) {
                setInstitutionFormData(prev => ({ ...prev, ...institutionFormData }));
                toast.success(data.message || "Institution profile updated successfully!");
                setInstitutionMessage("Institution profile updated successfully!");
            } else {
                const errorData = data;
                setInstitutionMessage(errorData.message || "Failed to update institution profile");
            }
        } catch (error) {
            setInstitutionMessage("An error occurred while updating institution profile");
        } finally {
            setLoading(false);
        }
    };

    const UpdateBankData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBankMessage("");

        try {
            const response = await api.put("/auth/update-bank-profile", bankFormData)
            const data = response.data;
            if (response.status === 200) {
                setBankFormData(prev => ({ ...prev, ...bankFormData }));
                toast.success(data.message || "Bank profile updated successfully!");
                setBankMessage("Bank profile updated successfully!");
            } else {
                const errorData = data;
                setBankMessage(errorData.message || "Failed to update bank profile");
            }
        } catch (error) {
            setBankMessage("An error occurred while updating bank profile");
        } finally {
            setLoading(false);
        }    
    };

    const UpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordMessage("");

        try {
            const response = await api.put("/auth/update-password", passwordFormData)
            const data = response.data;
            if (response.status === 200) {
                toast.success(data.message || "Password updated successfully!");
                setPasswordMessage("Password updated successfully!");
            } else {
                const errorData = data;
                setPasswordMessage(errorData.message || "Failed to update password");
            }
        } catch (error) {
            setBankMessage("An error occurred while updating bank profile");
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
                                        <label className="text-sm font-medium">Qualification</label>
                                        <Input type="text" className="input input-bordered w-full" value={profileFormData.qualification} onChange={e => setProfileFormData(prev => ({ ...prev, qualification: e.target.value }))} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Experience (in years)</label>
                                        <Input type="number" className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={{ MozAppearance: 'textfield' }} value={profileFormData.experience} onChange={e => setProfileFormData(prev => ({ ...prev, experience: e.target.value }))} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Aadhar Number</label>
                                        <Input type="number" className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={{ MozAppearance: 'textfield' }} value={profileFormData.aadharNumber} onChange={e => setProfileFormData(prev => ({ ...prev, aadharNumber: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Pan Number</label>
                                        <Input type="text" className="input input-bordered w-full" value={profileFormData.panNumber} onChange={e => setProfileFormData(prev => ({ ...prev, panNumber: e.target.value }))} />
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
                        <form onSubmit={UpdateInstitutionData}>
                            <Card className="flex flex-col p-8 items-start gap-4">
                                <div>
                                    <CardTitle className="text-lg font-bold">Institution/Business Information</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Update your institution/business information</CardDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Institution/Business Name</label>
                                        <Input type="text" className="input input-bordered w-full" value={institutionFormData.institutionName} onChange={e => setInstitutionFormData(prev => ({ ...prev, institutionName: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Institution/Business Address</label>
                                        <Input type="text" className="input input-bordered w-full" value={institutionFormData.institutionAddress} onChange={e => setInstitutionFormData(prev => ({ ...prev, institutionAddress: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Institution/Business Pincode</label>
                                        <Input type="number" className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={{ MozAppearance: 'textfield' }} value={institutionFormData.institutionPincode} onChange={e => setInstitutionFormData(prev => ({ ...prev, institutionPincode: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Institution/Business Phone</label>
                                        <Input type="number" className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={{ MozAppearance: 'textfield' }} value={institutionFormData.institutionPhone} onChange={e => setInstitutionFormData(prev => ({ ...prev, institutionPhone: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Institution/Business Email</label>
                                        <Input type="email" className="input input-bordered w-full" value={institutionFormData.institutionEmail} onChange={e => setInstitutionFormData(prev => ({ ...prev, institutionEmail: e.target.value }))} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading}>Save</Button>
                                {institutionMessage && (
                                    <div className="text-sm text-center text-green-600 mt-2">{institutionMessage}</div>
                                )}
                            </Card>

                        </form>

                        <form onSubmit={UpdateBankData}>
                            <Card className="flex flex-col p-8 items-start gap-4">
                                <div>
                                    <CardTitle className="text-lg font-bold">Bank Information</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Update your bank information</CardDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 w-full">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bank Name</label>
                                        <Input type="text" className="input input-bordered w-full" value={bankFormData.bankName} onChange={e => setBankFormData(prev => ({ ...prev, bankName: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Account Number</label>
                                        <Input type="number" className="input input-bordered w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={{ MozAppearance: 'textfield' }} value={bankFormData.bankAccountNumber} onChange={e => setBankFormData(prev => ({ ...prev, bankAccountNumber: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Account Holder Name</label>
                                        <Input type="text" className="input input-bordered w-full" value={bankFormData.bankAccountHolderName} onChange={e => setBankFormData(prev => ({ ...prev, bankAccountHolderName: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">IFSC Code</label>
                                        <Input type="text" className="input input-bordered w-full" value={bankFormData.bankIfscCode} onChange={e => setBankFormData(prev => ({ ...prev, bankIfscCode: e.target.value }))} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading}>Save</Button>
                                {bankMessage && (
                                    <div className="text-sm text-center text-green-600 mt-2">{bankMessage}</div>
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