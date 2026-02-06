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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { getUsers, deleteUser } from '@/lib/storage';
import { User as UserType } from '@/types';

const Customers = () => {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load customers
  useEffect(() => {
    const fetchedCustomers = getUsers();
    setCustomers(fetchedCustomers);
    setFilteredCustomers(fetchedCustomers);
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      if (deleteUser(customerId)) { // deleteUser returns true on success
        const updated = customers.filter(c => c._id !== customerId);
        setCustomers(updated);
        toast.success("Customer deleted successfully");
        // Re-filter if search is active (simplest way is to just let the effect handle it or update manually)
      } else {
        toast.error("Failed to delete user.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer base</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:bg-white transition-colors"
        />
      </div>

      {/* Customers Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-gray-900 text-lg">Customer List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium py-3">Customer</TableHead>
                  <TableHead className="text-gray-500 font-medium">Email</TableHead>
                  <TableHead className="text-gray-500 font-medium">Phone</TableHead>
                  <TableHead className="text-gray-500 font-medium">Role</TableHead>
                  <TableHead className="text-gray-500 font-medium">Join Date</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center">
                          <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center border border-blue-100">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {customer.phone ? (
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                            {customer.phone}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Not provided</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${customer.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                          {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer._id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <User className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-900">No customers found</p>
                        <p className="text-sm">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;