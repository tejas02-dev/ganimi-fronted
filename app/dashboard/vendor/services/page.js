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
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Services() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        address: "",
        pincode: "",
        price: "",
    });

    const [editFormData, setEditFormData] = useState({
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

    const handleEditServiceDialog = (service) => {
        setEditingService(service);
        setEditFormData({
            name: service.name,
            description: service.description,
            categoryId: service.categoryId || authUser?.categoryId,
            address: service.address,
            pincode: service.pincode,
            price: service.price,
        });
        setEditOpen(true);
    }

    const handleViewService = (service) => {
        router.push(`/dashboard/vendor/services/${service.id}`);
    }

    const handleDeleteService = async () => {
        try {
            const response = await api.delete(`/services/${deleteServiceId}`);
            const data = response.data;
            
            if (response.status === 200) {
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

    const handleEditService = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/services/${editingService.id}`, editFormData);
            const data = response.data;
            
            if (response.status === 200) {
                setEditOpen(false);
                // Update the service in the services array
                setServices(services.map(service => 
                    service.id === editingService.id 
                        ? { ...service, ...editFormData }
                        : service
                ));
                toast.success("Service updated successfully");
            } else {
                toast.error("Service update failed");
            }
        } catch (error) {
            console.error("Error updating service:", error);
            toast.error("Error updating service");
        }
    }

    const handleCreateService = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await api.post(`/services`, formData);
            const data = response.data;
            
            if (response.status === 200) {
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
        if (!authUser || !authUser.categoryId) {
            console.error("User or categoryId not available");
            return;
        }

        try {
            const response = await api.get(`/categories/${authUser.categoryId}`);
            const data = response.data;

            if (response.status === 200) {
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

    const fetchServices = async () => {
        try {
            const response = await api.get(`/services/user/${authUser.id}`);
            const data = response.data;
            if (response.status === 200) {
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
        if (authUser && authUser.categoryId) {
            setFormData({ ...formData, categoryId: authUser.categoryId });
            fetchCategories();
            fetchServices();
        }
    }, [authUser?.categoryId]);

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            {loading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>}
            {!loading && <Toaster />}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Services</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and track your service offerings</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 text-lg sm:text-xl font-semibold">Add New Service</DialogTitle>
                            <DialogDescription className="text-gray-600 text-sm">
                                Fill in the details below to create a new service offering.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateService} className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter service name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full"
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
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Category</label>
                                    <Input
                                        type="text"
                                        value={categories.name || "Loading..."}
                                        disabled
                                        className="bg-gray-50 w-full"
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
                                        className="w-full"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Pin Code</label>
                                        <Input
                                            type="number"
                                            placeholder="Pin code"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
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
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={formData.price || ""}
                                            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="w-full sm:flex-1 order-2 sm:order-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:flex-1 order-1 sm:order-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Service
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Service Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 text-lg sm:text-xl font-semibold">Edit Service</DialogTitle>
                            <DialogDescription className="text-gray-600 text-sm">
                                Update the details for your service.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditService} className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter service name"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Description</label>
                                    <Input
                                        type="text"
                                        placeholder="Brief description of your service"
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Service Category</label>
                                    <Input
                                        type="text"
                                        value={categories.name || "Loading..."}
                                        disabled
                                        className="bg-gray-50 w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <Input
                                        type="text"
                                        placeholder="Service location"
                                        value={editFormData.address}
                                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                        required
                                        className="w-full"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Pin Code</label>
                                        <Input
                                            type="number"
                                            placeholder="Pin code"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={editFormData.pincode || ""}
                                            onChange={e => setEditFormData(prev => ({ ...prev, pincode: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Service Price (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter price"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={editFormData.price || ""}
                                            onChange={e => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditOpen(false)}
                                    className="w-full sm:flex-1 order-2 sm:order-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:flex-1 order-1 sm:order-2"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Update Service
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
                <>
                    {/* Desktop Table View */}
                    <Card className="w-full p-0 rounded-lg hidden md:block">
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
                                                <div className="">
                                                    <p className="text-lg font-semibold text-gray-900">{service.name}</p>
                                                    <p className="text-sm text-gray-500">{service.description}</p>
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
                                                        onClick={() => handleViewService(service)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                                        onClick={() => handleEditServiceDialog(service)}
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {services.map(service => (
                            <Card key={service.id} className="w-full p-4 hover:shadow-md transition-shadow">
                                <div className="space-y-3">
                                    {/* Service Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                                        </div>
                                        <div className="ml-3">
                                            <span className="font-semibold text-green-600 text-xl">₹{service.price}</span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            {service.batches || 0} Batches
                                        </Badge>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            {service.totalStudents || 0} Students
                                        </Badge>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                            onClick={() => handleViewService(service)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                            onClick={() => handleEditServiceDialog(service)}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                            onClick={() => handleDeleteServiceDialog(service.id)}
                                        >
                                            <Trash className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            <Dialog open={deleteService} onOpenChange={setDeleteService}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-lg font-semibold">Delete Service</span>
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-3 text-center sm:text-left">
                            Are you sure you want to delete this service? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteService(false)}
                            className="w-full sm:flex-1 order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteService}
                            className="w-full sm:flex-1 order-1 sm:order-2"
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