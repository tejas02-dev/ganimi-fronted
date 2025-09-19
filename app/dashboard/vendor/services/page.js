"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, Trash, Loader2, Store } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function Services() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        address: "",
        pincode: "",
        price: "",
    });

    const [deleteService, setDeleteService] = useState();
    const [deleteServiceId, setDeleteServiceId] = useState();


    const handleDeleteServiceDialog = async (id) => {
        setDeleteServiceId(null);
        setDeleteServiceId(id);
        setDeleteService(true);
    }


    const handleDeleteService = async () => {
        try {
            const response = await fetch(`http://localhost:5500/api/v1/services/${deleteServiceId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setDeleteService(false);
                setServices(services.filter(service => service.id !== deleteServiceId));
                toast.success("Service deleted successfully");
            } else {
                toast.error("Service deletion failed");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Error deleting service");
        }
    }

    const handleCreateService = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await fetch(`http://localhost:5500/api/v1/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setOpen(false);
                setServices([...services, data.data[0]]);
                toast.success("Service created successfully");
            } else {
                toast.error("Service creation failed");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Error creating service");
        }
    }

    const fetchCategories = async () => {
        if (!user || !user.categoryId) {
            console.error("User or categoryId not available");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5500/api/v1/categories/${user.categoryId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            if (response.ok) {
                const data = await response.json();
                setCategories(data.data);
                console.log(data.data);
            } else {
                toast.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Error fetching categories");
        }
    }

    const checkAuthAndFetchData = async () => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                router.push("/login");
                return;
            }

            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } catch (error) {
            console.error("Error loading dashboard:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch(`http://localhost:5500/api/v1/services/${user.id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setServices(data.data);
                console.log(data.data);
            } else {
                toast.error("Failed to fetch services");
            }
        }
        catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Error fetching services");
        }
    }

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    useEffect(() => {
        if (user && user.categoryId) {
            setFormData({ ...formData, categoryId: user.categoryId });
            fetchCategories();
            fetchServices();
        }
    }, [user?.categoryId]);

    return (
        <div className="p-10">
            {loading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>}
            {!loading && <Toaster />}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Services</h1>
                    <p className="text-gray-600 mt-1">Manage and track your service offerings</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 text-xl font-semibold">Add New Service</DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Fill in the details below to create a new service offering.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateService} className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter service name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Description</label>
                                    <Input
                                        type="text"
                                        placeholder="Brief description of your service"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Category</label>
                                    <Input
                                        type="text"
                                        value={categories.name || "Loading..."}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <Input
                                        type="text"
                                        placeholder="Service location"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Pin Code</label>
                                        <Input
                                            type="number"
                                            placeholder="Pin code"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={formData.pincode || ""}
                                            onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Service Price (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter price"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={formData.price || ""}
                                            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>


                            </div>

                            <DialogFooter className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Service
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {services.length === 0 ? (
                <Card className="flex justify-center items-center w-full h-64">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No services found</p>
                        <p className="text-gray-400 text-sm">Create your first service to get started</p>
                    </div>
                </Card>
            ) : (
                <Card className="w-full p-0 rounded-lg">
                    <div className="overflow-x-auto">

                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">Service Name</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-700">Batches</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-700">Students</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-700">Price</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map(service => (
                                    <TableRow key={service.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="font-semibold text-gray-900">{service.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                {service.batches || 0} Batches
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                {service.totalStudents || 0} Students
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="font-semibold text-green-600 text-lg">₹{service.price}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                                >
                                                    <Pencil className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                    onClick={() => handleDeleteServiceDialog(service.id)}
                                                >
                                                    <Trash className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            <Dialog open={deleteService} onOpenChange={setDeleteService}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash className="w-5 h-5 text-red-600" />
                            </div>
                            Delete Service
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            Are you sure you want to delete this service? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteService(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteService}
                            className="flex-1"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}