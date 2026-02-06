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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload
} from 'lucide-react';
import {
  getCategories,
  setCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/lib/storage';
import { Category } from '@/types';

const Categories = () => {
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true
  });

  // Load categories and seed defaults if empty
  useEffect(() => {
    let fetchedCategories = getCategories();

    if (fetchedCategories.length === 0) {
      const defaultCategories: Category[] = [
        {
          _id: 'cat_shoes',
          name: 'Shoes',
          slug: 'shoes',
          description: 'Footwear for all occasions',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_watches',
          name: 'Watches',
          slug: 'watches',
          description: 'Premium timepieces',
          image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_tshirts',
          name: 'T-Shirts',
          slug: 't-shirts',
          description: 'Casual comfort wear',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_shirts',
          name: 'Shirts',
          slug: 'shirts',
          description: 'Formal and casual shirts',
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_heels',
          name: 'Heels',
          slug: 'heels',
          description: 'Elegant footwear for women',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_boys',
          name: 'Boys',
          slug: 'boys',
          description: 'Fashion for boys',
          image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1974&auto=format&fit=crop',
          isActive: true
        },
        {
          _id: 'cat_girls',
          name: 'Girls',
          slug: 'girls',
          description: 'Fashion for girls',
          image: 'https://images.unsplash.com/photo-1621452773781-0f992fd0f5d0?q=80&w=1974&auto=format&fit=crop',
          isActive: true
        }
      ];
      setCategories(defaultCategories);
      fetchedCategories = defaultCategories;
    }

    setCategoriesState(fetchedCategories);
    setFilteredCategories(fetchedCategories);
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Update existing category
      const updatedCat = updateCategory(editingCategory._id, formData);
      if (updatedCat) {
        const updatedCategories = categories.map(cat =>
          cat._id === editingCategory._id ? updatedCat : cat
        );
        setCategoriesState(updatedCategories);
        setFilteredCategories(updatedCategories);
      }
    } else {
      // Create new category
      const newCategory = createCategory(formData);
      const updatedCategories = [...categories, newCategory];
      setCategoriesState(updatedCategories);
      setFilteredCategories(updatedCategories);
    }

    // Reset form and close dialog
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image || '',
      isActive: category.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
      const updatedCategories = categories.filter(c => c._id !== categoryId);
      setCategoriesState(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true
    });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-1">Manage product categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            resetForm();
          } else {
            setIsDialogOpen(open);
          }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingCategory(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-gray-100 shadow-xl">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="text-gray-900 font-bold text-xl">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {editingCategory
                  ? 'Update the category details below.'
                  : 'Fill in the category details to add a new category.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleSlugChange}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                  placeholder="e.g. Running Shoes"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Slug <span className="text-red-500">*</span></label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white font-mono text-sm"
                  placeholder="running-shoes"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  placeholder="Brief description of the category..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                <Input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-200 text-gray-900 focus:bg-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2 flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 ml-3">Active Category</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
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
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:bg-white transition-colors"
        />
      </div>

      {/* Categories Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-gray-900 text-lg">Category List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium py-3">Category</TableHead>
                  <TableHead className="text-gray-500 font-medium">Description</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm"
                            />
                          ) : (
                            <div className="bg-gray-100 border border-gray-200 rounded-lg w-10 h-10 flex items-center justify-center">
                              <span className="text-xs text-gray-400">N/A</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{category.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs text-sm truncate">
                        {category.description || <span className="text-gray-400 italic">No description</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${category.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category._id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Search className="h-6 w-6 opacity-30" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">No categories found</p>
                        <p className="text-sm">Try adding a new category</p>
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

export default Categories;