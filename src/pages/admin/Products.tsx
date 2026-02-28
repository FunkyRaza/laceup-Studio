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
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn, getImageUrl } from '@/lib/utils';
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

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    category: '',
    gender: 'Unisex',
    stock: 0,
    featured: false,
    isActive: true,
    images: [],
    sizes: [],
    colors: []
  });

  const [tagsInput, setTagsInput] = useState('');
  const [sizeInput, setSizeInput] = useState({ name: '', quantity: 0 });
  const [colorInput, setColorInput] = useState({ name: '', code: '', quantity: 0 });

  // Load products
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItemToArray = (field: 'images' | 'tags', value: string) => {
    if (!value) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value]
    }));
  };

  const removeItemFromArray = (field: 'images' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (!sizeInput.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), { name: sizeInput.name, quantity: parseInt(sizeInput.quantity.toString()) || 0 }]
    }));
    setSizeInput({ name: '', quantity: 0 });
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (!colorInput.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name: colorInput.name, code: colorInput.code, quantity: parseInt(colorInput.quantity.toString()) || 0 }]
    }));
    setColorInput({ name: '', code: '', quantity: 0 });
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
    }));
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToArray('tags', tagsInput);
      setTagsInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        // Backend expects 'category' as ID string, ensure it's provided
        // Set main image from first image in array, or keep existing image field
        image: formData.images && formData.images.length > 0 ? formData.images[0] : (formData.image || '/placeholder.svg'),
        sizes: formData.sizes || [],
        colors: formData.colors || []
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }

      await fetchProducts();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      category: product.category?._id || product.category, // Handle populated category
      sizes: product.sizes || [],
      colors: product.colors || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: 0, oldPrice: 0, category: '',
      gender: 'Unisex', stock: 0, featured: false, isActive: true,
      images: [], tags: [], sizes: [], colors: []
    });
    setEditingProduct(null);
    setActiveTab("general");
    setTagsInput('');
    setSizeInput({ name: '', quantity: 0 });
    setColorInput({ name: '', code: '', quantity: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-100 shadow-xl p-0 gap-0">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription className="text-gray-500 mt-1">
                {editingProduct ? 'Update product details and specifications' : 'Create a new product listing with all details'}
              </DialogDescription>
            </div>

            <div className="p-6">
              <form id="product-form" onSubmit={handleSubmit}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b border-gray-100 bg-transparent p-0 mb-6 h-auto rounded-none">
                    <TabsTrigger value="general" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-gray-500">General</TabsTrigger>
                    <TabsTrigger value="media" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-gray-500">Media</TabsTrigger>
                    <TabsTrigger value="meta" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-gray-500">Meta Options</TabsTrigger>
                  </TabsList>

                  {/* GENERAL TAB */}
                  <TabsContent value="general" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="bg-gray-50 border-gray-200" required />
                      </div>
                      {/* Sub Category */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Sub Category</label>
                        <Input name="subCategory" value={formData.subCategory} onChange={handleInputChange} placeholder="e.g. Running Shoes" className="bg-gray-50 border-gray-200" />
                      </div>

                      {/* Prices */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">New Price (₹) <span className="text-red-500">*</span></label>
                        <Input type="number" name="price" value={formData.price} onChange={handleInputChange} className="bg-gray-50 border-gray-200" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Old Price (₹)</label>
                        <Input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="bg-gray-50 border-gray-200" min="0" />
                      </div>

                      {/* Quantity & Code */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                        <Input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="bg-gray-50 border-gray-200" min="0" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">HSN Code</label>
                        <Input name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                      </div>

                      {/* Selectors */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Brand</label>
                        <Input name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Nike" className="bg-gray-50 border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue placeholder="Select Category" /></SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quality & Description */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Quality / Variant</label>
                        <Input name="quality" value={formData.quality} onChange={handleInputChange} placeholder="e.g. Premium First Copy" className="bg-gray-50 border-gray-200" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Tags</label>
                        <Input
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          onKeyDown={handleTagsKeyDown}
                          placeholder="Type tag and press Enter"
                          className="bg-gray-50 border-gray-200"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags?.map((tag, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeItemFromArray('tags', i)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Sizes */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Sizes</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Size (e.g. S, M, L)"
                            value={sizeInput.name}
                            onChange={(e) => setSizeInput({...sizeInput, name: e.target.value})}
                            className="bg-gray-50 border-gray-200"
                          />
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={sizeInput.quantity}
                            onChange={(e) => setSizeInput({...sizeInput, quantity: parseInt(e.target.value) || 0})}
                            className="bg-gray-50 border-gray-200 w-24"
                          />
                          <Button type="button" onClick={addSize} variant="secondary">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(formData.sizes || []).map((size: any, i: number) => (
                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                              {size.name}: {size.quantity}
                              <button type="button" onClick={() => removeSize(i)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Colors</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Color name (e.g. Red, Blue)"
                            value={colorInput.name}
                            onChange={(e) => setColorInput({...colorInput, name: e.target.value})}
                            className="bg-gray-50 border-gray-200"
                          />
                          <Input
                            placeholder="Color code (e.g. #FF0000)"
                            value={colorInput.code}
                            onChange={(e) => setColorInput({...colorInput, code: e.target.value})}
                            className="bg-gray-50 border-gray-200"
                          />
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={colorInput.quantity}
                            onChange={(e) => setColorInput({...colorInput, quantity: parseInt(e.target.value) || 0})}
                            className="bg-gray-50 border-gray-200 w-24"
                          />
                          <Button type="button" onClick={addColor} variant="secondary">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(formData.colors || []).map((color: any, i: number) => (
                            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                              {color.name}{color.code && ` (${color.code})`}: {color.quantity}
                              <button type="button" onClick={() => removeColor(i)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                          Published
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                          Featured
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* MEDIA TAB */}
                  <TabsContent value="media" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Detailed Images (URLs)</label>
                        <div className="flex gap-2">
                          <Input id="image-url-input" placeholder="Enter Image URL" className="bg-gray-50 border-gray-200" />
                          <Button type="button" onClick={() => {
                            const el = document.getElementById('image-url-input') as HTMLInputElement;
                            addItemToArray('images', el.value);
                            el.value = '';
                          }} variant="secondary">Add</Button>
                        </div>
                        <p className="text-xs text-gray-500">Add URLs for now. Drag & Drop upload requires backend storage.</p>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {formData.images?.map((url: string, i: number) => (
                            <div key={i} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                              <img src={getImageUrl(url)} alt={`Preview ${i}`} className="w-full h-24 object-cover" />
                              <button type="button" onClick={() => removeItemFromArray('images', i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Video URL</label>
                        <Input name="video" value={formData.video} onChange={handleInputChange} placeholder="https://..." className="bg-gray-50 border-gray-200" />
                      </div>
                    </div>
                  </TabsContent>

                  {/* META OPTIONS TAB */}
                  <TabsContent value="meta" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Meta Title</label>
                        <Input name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Meta Keywords</label>
                        <Input name="metaKeywords" value={formData.metaKeywords} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                        <textarea
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" form="product-form" className="bg-blue-600 hover:bg-blue-700">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* PRODUCTS TABLE (Simplified for brevity) */}
      <Card className="bg-gray-800 border-gray-700 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-gray-100">All Products</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-8 bg-gray-700 border-gray-600 text-gray-100" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ModernTable 
            columns={[
              {
                key: 'image',
                title: 'Image',
                render: (_, record) => (
                  <img
                    src={getImageUrl(record.image || record.images?.[0])}
                    alt=""
                    className="w-10 h-10 object-cover rounded-md bg-gray-700 border border-gray-600"
                  />
                )
              },
              {
                key: 'name',
                title: 'Product',
                render: (value) => <span className="font-medium text-gray-200">{value}</span>
              },
              {
                key: 'category',
                title: 'Category',
                render: (value) => <span className="capitalize text-gray-400">{typeof value === 'object' ? value?.name : value}</span>
              },
              {
                key: 'brand',
                title: 'Brand',
                render: (value) => <span className="text-gray-400">{value || '-'}</span>
              },
              {
                key: 'sizes',
                title: 'Sizes',
                render: (value) => (
                  <div className="flex flex-wrap gap-1">
                    {(value || []).map((size: any, idx: number) => (
                      <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs">
                        {size.name}: {size.quantity}
                      </span>
                    ))}
                    {(value || []).length === 0 && <span className="text-gray-500 text-xs">None</span>}
                  </div>
                )
              },
              {
                key: 'colors',
                title: 'Colors',
                render: (value) => (
                  <div className="flex flex-wrap gap-1">
                    {(value || []).map((color: any, idx: number) => (
                      <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs">
                        {color.name}{color.code ? ` (${color.code})` : ''}: {color.quantity}
                      </span>
                    ))}
                    {(value || []).length === 0 && <span className="text-gray-500 text-xs">None</span>}
                  </div>
                )
              },
              {
                key: 'price',
                title: 'Price',
                render: (value) => <span className="font-medium text-gray-200">₹{value}</span>
              },
              {
                key: 'stock',
                title: 'Stock',
                render: (value) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${value > 10 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                    {value} in stock
                  </span>
                )
              },
              {
                key: 'actions',
                title: 'Actions',
                render: (_, record) => (
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/30"><Edit className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 text-gray-100 border border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the product and remove it from our servers.
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
            data={filteredProducts}
            emptyText="No products found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;