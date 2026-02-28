import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  Trash2,
  Plus,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ModernTable from '@/components/admin/ui/ModernTable';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
  });

  // Load customers
  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/users');
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCustomer) {
        await api.put(`/users/${editingCustomer._id}`, formData);
        toast.success("Customer updated successfully");
      } else {
        await api.post('/users', formData);
        toast.success("Customer created successfully");
      }
      fetchCustomers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      role: customer.role,
      password: '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'user', password: '' });
    setEditingCustomer(null);
  };

  const handleDelete = async (customerId: string) => {
    try {
      await api.delete(`/users/${customerId}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-gray-100 shadow-xl">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="text-gray-900 font-bold text-xl">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {editingCustomer
                  ? 'Update the customer details below.'
                  : 'Fill in the customer details to add a new customer.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
              {!editingCustomer && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password <span className="text-red-500">*</span></label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Role</label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingCustomer ? 'Update Customer' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:bg-white transition-colors"
        />
      </div>

      {/* Customers Table */}
      <Card className="bg-gray-800 border-gray-700 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-700 bg-gray-750">
          <CardTitle className="text-gray-100 text-lg">Customer List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ModernTable 
            columns={[
              {
                key: 'name',
                title: 'Customer',
                render: (_, record) => (
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center border border-blue-500/30">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-200">{record.name}</div>
                    </div>
                  </div>
                )
              },
              {
                key: 'email',
                title: 'Email',
                render: (value) => (
                  <div className="flex items-center">
                    <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    <span className="text-gray-300">{value}</span>
                  </div>
                )
              },
              {
                key: 'role',
                title: 'Role',
                render: (value) => (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${value === 'admin'
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'User'}
                  </span>
                )
              },
              {
                key: 'createdAt',
                title: 'Join Date',
                render: (value) => <span className="text-gray-400 text-sm">{new Date(value).toLocaleDateString()}</span>
              },
              {
                key: 'actions',
                title: 'Actions',
                render: (_, record) => (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(record)}
                      className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-900/30 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 text-gray-100 border border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the customer account and remove their data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-300 border-gray-600 hover:bg-gray-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(record._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )
              }
            ]}
            data={filteredCustomers}
            emptyText="No customers found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
