"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, Trash, Loader2, Store } from "lucide-react";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
export default function Services() {
    const router = useRouter();
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [batches, setBatches] = useState([]);
    const [batchOpen, setBatchOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [batchData, setBatchData] = useState({
        name: "",
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        ageGroup: "",
        price: "",
        capacity: "",
        startDate: "",
        endDate: "",
        serviceId: id,
    });
    const [editBatchData, setEditBatchData] = useState({
        name: "",
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        ageGroup: "",
        price: "",
        capacity: "",
        startDate: "",
        endDate: "",
        serviceId: id,
    });
    const [editBatchOpen, setEditBatchOpen] = useState(false);
    const [deleteBatch, setDeleteBatch] = useState(false);
    const [deleteBatchId, setDeleteBatchId] = useState(null);

    const handleEditBatchDialog = (batch) => {
        setEditingBatch(batch);
        
        // Helper function to format date for HTML date input (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
        };
        
        setEditBatchData({
            name: batch.name,
            daysOfWeek: typeof batch.daysOfWeek === 'string' ? batch.daysOfWeek.split(', ') : batch.daysOfWeek || [],
            startTime: batch.startTime,
            endTime: batch.endTime,
            ageGroup: batch.ageGroup,
            price: batch.price,
            capacity: batch.capacity,
            startDate: formatDateForInput(batch.startDate),
            endDate: formatDateForInput(batch.endDate),
            serviceId: id,
        });
        setEditBatchOpen(true);
    }

    const handleDeleteBatchDialog = (batchId) => {
        setDeleteBatchId(batchId);
        setDeleteBatch(true);
    }

    const fetchService = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5500/api/v1/services/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            console.log('API Response:', data); // Debug log

            // Handle different response structures
            if (data.data) {
                setService(data.data);
            } else if (Array.isArray(data) && data.length > 0) {
                setService(data[0]);
            } else if (data.service) {
                setService(data.service);
            } else {
                setService(null);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching service:', error);
            toast.error('Failed to load service details');
            setLoading(false);
        }
    }

    const fetchBatches = async () => {
        try {
            const response = await fetch(`http://localhost:5500/api/v1/batches/service/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            if (data.data) {
                setBatches(data.data);
            } else {
                setBatches([]);
            }
        }
        catch (error) {
            console.error('Error fetching batches:', error);
            toast.error('Failed to load batches');
        }
    }

    const createBatch = async (e) => {
        e.preventDefault();
        console.log(batchData);
        try {
            const batchPayload = {
                ...batchData,
                daysOfWeek: batchData.daysOfWeek.join(', ') // Convert array to comma-separated string for API
            };
            
            const response = await fetch(`http://localhost:5500/api/v1/batches`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(batchPayload)
            });
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            if (data.data) {
                setBatches([...batches, data.data[0]]);
                toast.success('Batch created successfully');
                setBatchOpen(false);
            } else {
                toast.error('Failed to create batch');
            }
        }
        catch (error) {
            console.error('Error creating batch:', error);
            toast.error('Failed to create batch');
        }
    }

    const updateBatch = async (e) => {
        e.preventDefault();
        console.log(editBatchData);
        try {
            const batchPayload = {
                ...editBatchData,
                daysOfWeek: Array.isArray(editBatchData.daysOfWeek) ? editBatchData.daysOfWeek.join(', ') : editBatchData.daysOfWeek
            };
            
            const response = await fetch(`http://localhost:5500/api/v1/batches/${editingBatch.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(batchPayload)
            });
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            if (data.data) {
                setBatches(batches.map(batch => batch.id === editingBatch.id ? data.data : batch));
                toast.success('Batch updated successfully');
                setEditBatchOpen(false);
            } else {
                toast.error('Failed to update batch');
            }
        }
        catch (error) {
            console.error('Error updating batch:', error);
            toast.error('Failed to update batch');
        }
    }

    const handleDeleteBatch = async () => {
        try {
            const response = await fetch(`http://localhost:5500/api/v1/batches/${deleteBatchId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            if (data.status==='ok') {
                setBatches(batches.filter(batch => batch.id !== deleteBatchId));
                toast.success('Batch deleted successfully');
                setDeleteBatch(false);
            } else {
                toast.error('Failed to delete batch');
            }
        }
        catch (error) {
            console.error('Error deleting batch:', error);
            toast.error('Failed to delete batch');
        }
    }

    useEffect(() => {
        fetchService();
        fetchBatches();
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <Toaster />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/vendor/services">Services</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{service?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {loading ? (
                <Card className="w-full mt-6">
                    <CardHeader>
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="animate-spin w-6 h-6 mr-2" />
                            <span>Loading service details...</span>
                        </div>
                    </CardHeader>
                </Card>
            ) : service ? (
                <>
                <div className="mt-6">
                    {/* Compact Service Header */}
                    <Card className="w-full mb-6">
                        <CardHeader className="">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <CardTitle className="text-2xl font-bold text-gray-900">
                                            {service.name}
                                        </CardTitle>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Active
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-gray-600 mb-4">
                                        {service.description}
                                    </CardDescription>
                                    
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div>
                                            <span className="text-gray-500">Price:</span>
                                            <span className="ml-2 font-semibold text-green-600">₹{service.price}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Address:</span>
                                            <span className="ml-2 font-medium">{service.address || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Pincode:</span>
                                            <span className="ml-2 font-medium">{service.pincode || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push('/dashboard/vendor/services')}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            // You can add edit functionality here
                                            router.push('/dashboard/vendor/services');
                                        }}
                                        className="bg-primary hover:bg-primary/50"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <Card className="w-full">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Batches</CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                Manage batches for this service
                            </CardDescription>
                        </div>
                        <Button className="bg-primary hover:bg-primary/50" onClick={() => setBatchOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Create Batch
                        </Button>
                    </CardHeader>

                    {/* {Batches Table} */}
                    <CardContent className="px-6 pb-6 ">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 border-b border-gray-200">
                                            <TableHead className="font-semibold text-gray-700 py-4 px-6">Batch Name</TableHead>
                                            <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">Batch Price</TableHead>
                                            <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">Students</TableHead>
                                            <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">Status</TableHead>
                                            <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batches.map((batch) => (
                                        <TableRow key={batch.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="font-medium text-gray-900 py-4 px-6">
                                                <div>
                                                    <div className="font-semibold">{batch.name}</div>
                                                     <div className="text-sm text-gray-500">Created on {new Date(batch.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 py-4 px-6 text-center">
                                                <span className="text-green-600 font-semibold">₹{batch.price}</span>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 py-4 px-6 text-center">
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    {batch.capacity} Students
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 py-4 px-6 text-center">
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    {batch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900 py-4 px-6">
                                                <div className="flex justify-center gap-2">
                                                    <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" onClick={() => router.push(`/dashboard/vendor/services/batch/${batch.id}`)}>
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200" onClick={() => handleEditBatchDialog(batch)}>
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleDeleteBatchDialog(batch.id)}>
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
                        </div>
                    </CardContent>
                    
                </Card>
                </>
            ) : (
                <Card className="w-full mt-6">
                    <CardHeader>
                        <div className="text-center py-8">
                            <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <CardTitle className="text-xl text-gray-500">Service not found</CardTitle>
                            <CardDescription className="mt-2">
                                The service you're looking for doesn't exist or you don't have permission to view it.
                            </CardDescription>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => router.push('/dashboard/vendor/services')}
                            >
                                Back to Services
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            )}

            <Dialog open={batchOpen} onOpenChange={setBatchOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Batch</DialogTitle>
                        <DialogDescription>Create a new batch for this service</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createBatch} className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Batch Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter batch name"
                                        value={batchData.name}
                                        onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Days of Week</label>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="grid grid-cols-7 gap-2">
                                            {[
                                                { key: 'monday', label: 'Mon', full: 'Monday' },
                                                { key: 'tuesday', label: 'Tue', full: 'Tuesday' },
                                                { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
                                                { key: 'thursday', label: 'Thu', full: 'Thursday' },
                                                { key: 'friday', label: 'Fri', full: 'Friday' },
                                                { key: 'saturday', label: 'Sat', full: 'Saturday' },
                                                { key: 'sunday', label: 'Sun', full: 'Sunday' }
                                            ].map((day) => (
                                                <div key={day.key} className="flex flex-col items-center space-y-2">
                                                    <Checkbox
                                                        id={day.key}
                                                        checked={batchData.daysOfWeek.includes(day.full)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setBatchData(prev => ({
                                                                    ...prev,
                                                                    daysOfWeek: [...prev.daysOfWeek, day.full]
                                                                }));
                                                            } else {
                                                                setBatchData(prev => ({
                                                                    ...prev,
                                                                    daysOfWeek: prev.daysOfWeek.filter(d => d !== day.full)
                                                                }));
                                                            }
                                                        }}
                                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                    />
                                                    <label 
                                                        htmlFor={day.key}
                                                        className="text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                                                    >
                                                        {day.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {batchData.daysOfWeek.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="text-xs text-gray-500">Selected:</span>
                                                    {batchData.daysOfWeek.map((day, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                                            {day}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                    
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={batchData.startTime ? (() => {
                                                const [hours, minutes] = batchData.startTime.split(':');
                                                const hour24 = parseInt(hours);
                                                const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                const period = hour24 < 12 ? 'AM' : 'PM';
                                                return `${hour12}:${minutes} ${period}`;
                                            })() : ''}
                                            onValueChange={(value) => {
                                                const [time, period] = value.split(' ');
                                                const [hours, minutes] = time.split(':');
                                                let hour24 = parseInt(hours);
                                                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                                                if (period === 'AM' && hour24 === 12) hour24 = 0;
                                                const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
                                                setBatchData({ ...batchData, startTime: time24 });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select start time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }, (_, i) => {
                                                    const hour24 = Math.floor(i / 2);
                                                    const minutes = i % 2 === 0 ? '00' : '30';
                                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                    const period = hour24 < 12 ? 'AM' : 'PM';
                                                    const displayTime = `${hour12}:${minutes} ${period}`;
                                                    const value24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
                                                    return (
                                                        <SelectItem key={i} value={`${hour12}:${minutes} ${period}`}>
                                                            {displayTime}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">End Time</label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={batchData.endTime ? (() => {
                                                const [hours, minutes] = batchData.endTime.split(':');
                                                const hour24 = parseInt(hours);
                                                const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                const period = hour24 < 12 ? 'AM' : 'PM';
                                                return `${hour12}:${minutes} ${period}`;
                                            })() : ''}
                                            onValueChange={(value) => {
                                                const [time, period] = value.split(' ');
                                                const [hours, minutes] = time.split(':');
                                                let hour24 = parseInt(hours);
                                                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                                                if (period === 'AM' && hour24 === 12) hour24 = 0;
                                                const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
                                                setBatchData({ ...batchData, endTime: time24 });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select end time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }, (_, i) => {
                                                    const hour24 = Math.floor(i / 2);
                                                    const minutes = i % 2 === 0 ? '00' : '30';
                                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                    const period = hour24 < 12 ? 'AM' : 'PM';
                                                    const displayTime = `${hour12}:${minutes} ${period}`;
                                                    return (
                                                        <SelectItem key={i} value={`${hour12}:${minutes} ${period}`}>
                                                            {displayTime}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                </div>                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Age Group</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter age group"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={batchData.ageGroup || ""}
                                            onChange={e => setBatchData(prev => ({ ...prev, ageGroup: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Batch Price (₹)</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter batch price"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={batchData.price || ""}
                                            onChange={e => setBatchData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Capacity</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter capacity"
                                            className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                            style={{ MozAppearance: 'textfield' }}
                                            value={batchData.capacity || ""}
                                            onChange={e => setBatchData(prev => ({ ...prev, capacity: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                                        <Input
                                            type="date"
                                            placeholder="Enter start date"
                                            value={batchData.startDate || ""}
                                            onChange={e => setBatchData(prev => ({ ...prev, startDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">End Date</label>
                                        <Input
                                            type="date"
                                            placeholder="Enter end date"
                                            value={batchData.endDate || ""}
                                            onChange={e => setBatchData(prev => ({ ...prev, endDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setBatchOpen(false)}
                                    className="w-full sm:flex-1 order-2 sm:order-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:flex-1 order-1 sm:order-2"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Create Batch
                                </Button>
                            </DialogFooter>
                        </form>
                </DialogContent>
            </Dialog>

            <Dialog open={editBatchOpen} onOpenChange={setEditBatchOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Batch</DialogTitle>
                        <DialogDescription>Edit the batch for this service</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateBatch} className="space-y-4 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Batch Name</label>
                                <Input
                                    type="text"
                                    placeholder="Enter batch name"
                                    value={editBatchData.name}
                                    onChange={(e) => setEditBatchData({ ...editBatchData, name: e.target.value })}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Days of Week</label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="grid grid-cols-7 gap-2">
                                        {[
                                            { key: 'monday', label: 'Mon', full: 'Monday' },
                                            { key: 'tuesday', label: 'Tue', full: 'Tuesday' },
                                            { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
                                            { key: 'thursday', label: 'Thu', full: 'Thursday' },
                                            { key: 'friday', label: 'Fri', full: 'Friday' },
                                            { key: 'saturday', label: 'Sat', full: 'Saturday' },
                                            { key: 'sunday', label: 'Sun', full: 'Sunday' }
                                        ].map((day) => (
                                            <div key={day.key} className="flex flex-col items-center space-y-2">
                                                <Checkbox
                                                    id={`edit-${day.key}`}
                                                    checked={editBatchData.daysOfWeek.includes(day.full)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setEditBatchData(prev => ({
                                                                ...prev,
                                                                daysOfWeek: [...prev.daysOfWeek, day.full]
                                                            }));
                                                        } else {
                                                            setEditBatchData(prev => ({
                                                                ...prev,
                                                                daysOfWeek: prev.daysOfWeek.filter(d => d !== day.full)
                                                            }));
                                                        }
                                                    }}
                                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <label 
                                                    htmlFor={`edit-${day.key}`}
                                                    className="text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                                                >
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {editBatchData.daysOfWeek.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex flex-wrap gap-1">
                                                <span className="text-xs text-gray-500">Selected:</span>
                                                {editBatchData.daysOfWeek.map((day, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                                        {day}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={editBatchData.startTime ? (() => {
                                                const [hours, minutes] = editBatchData.startTime.split(':');
                                                const hour24 = parseInt(hours);
                                                const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                const period = hour24 < 12 ? 'AM' : 'PM';
                                                return `${hour12}:${minutes} ${period}`;
                                            })() : ''}
                                            onValueChange={(value) => {
                                                const [time, period] = value.split(' ');
                                                const [hours, minutes] = time.split(':');
                                                let hour24 = parseInt(hours);
                                                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                                                if (period === 'AM' && hour24 === 12) hour24 = 0;
                                                const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
                                                setEditBatchData({ ...editBatchData, startTime: time24 });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select start time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }, (_, i) => {
                                                    const hour24 = Math.floor(i / 2);
                                                    const minutes = i % 2 === 0 ? '00' : '30';
                                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                    const period = hour24 < 12 ? 'AM' : 'PM';
                                                    const displayTime = `${hour12}:${minutes} ${period}`;
                                                    return (
                                                        <SelectItem key={i} value={`${hour12}:${minutes} ${period}`}>
                                                            {displayTime}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">End Time</label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={editBatchData.endTime ? (() => {
                                                const [hours, minutes] = editBatchData.endTime.split(':');
                                                const hour24 = parseInt(hours);
                                                const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                const period = hour24 < 12 ? 'AM' : 'PM';
                                                return `${hour12}:${minutes} ${period}`;
                                            })() : ''}
                                            onValueChange={(value) => {
                                                const [time, period] = value.split(' ');
                                                const [hours, minutes] = time.split(':');
                                                let hour24 = parseInt(hours);
                                                if (period === 'PM' && hour24 !== 12) hour24 += 12;
                                                if (period === 'AM' && hour24 === 12) hour24 = 0;
                                                const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
                                                setEditBatchData({ ...editBatchData, endTime: time24 });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select end time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 48 }, (_, i) => {
                                                    const hour24 = Math.floor(i / 2);
                                                    const minutes = i % 2 === 0 ? '00' : '30';
                                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                                    const period = hour24 < 12 ? 'AM' : 'PM';
                                                    const displayTime = `${hour12}:${minutes} ${period}`;
                                                    return (
                                                        <SelectItem key={i} value={`${hour12}:${minutes} ${period}`}>
                                                            {displayTime}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Age Group</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter age group"
                                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                        style={{ MozAppearance: 'textfield' }}
                                        value={editBatchData.ageGroup || ""}
                                        onChange={e => setEditBatchData(prev => ({ ...prev, ageGroup: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Batch Price (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter batch price"
                                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                        style={{ MozAppearance: 'textfield' }}
                                        value={editBatchData.price || ""}
                                        onChange={e => setEditBatchData(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Capacity</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter capacity"
                                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                                        style={{ MozAppearance: 'textfield' }}
                                        value={editBatchData.capacity || ""}
                                        onChange={e => setEditBatchData(prev => ({ ...prev, capacity: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <Input
                                        type="date"
                                        placeholder="Enter start date"
                                        value={editBatchData.startDate || ""}
                                        onChange={e => setEditBatchData(prev => ({ ...prev, startDate: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <Input
                                        type="date"
                                        placeholder="Enter end date"
                                        value={editBatchData.endDate || ""}
                                        onChange={e => setEditBatchData(prev => ({ ...prev, endDate: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditBatchOpen(false)}
                                className="w-full sm:flex-1 order-2 sm:order-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:flex-1 order-1 sm:order-2"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Update
                            </Button>
                        </DialogFooter>
                        </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteBatch} onOpenChange={setDeleteBatch}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-lg font-semibold">Delete Batch</span>
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-3 text-center sm:text-left">
                            Are you sure you want to delete this batch? This action cannot be undone and will remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteBatch(false)}
                            className="w-full sm:flex-1 order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBatch}
                            className="w-full sm:flex-1 order-1 sm:order-2"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Batch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}