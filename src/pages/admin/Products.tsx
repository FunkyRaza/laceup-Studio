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
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/lib/storage';
import { Product } from '@/types';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    category: 'watches',
    subCategory: '',
    gender: 'unisex',
    stock: 0,
    featured: false,
    isActive: true,
    hsnCode: '',
    brand: '',
    quality: '',
    tags: [],
    images: [],
    video: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: ''
  });

  const [tagsInput, setTagsInput] = useState('');

  // Load products
  useEffect(() => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
    setFilteredProducts(fetchedProducts);
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Check if it's a checkbox
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

  const handleTagsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToArray('tags', tagsInput);
      setTagsInput('');
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure required fields
    if (!formData.name || !formData.price) {
      toast.error("Name and Price are required!");
      return;
    }

    const payload = {
      ...formData,
      images: formData.images?.length ? formData.images : ['/placeholder.svg'], // Default image if none
    } as any; // Cast for simplicity with partials

    if (editingProduct) {
      // Update existing product
      const updatedProduct = updateProduct(editingProduct._id, payload);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? updatedProduct : p));
        setFilteredProducts(prev => prev.map(p => p._id === editingProduct._id ? updatedProduct : p));
      }
    } else {
      // Create new product
      const newProduct = createProduct(payload);
      setProducts(prev => [...prev, newProduct]);
      setFilteredProducts(prev => [...prev, newProduct]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      setFilteredProducts(prev => prev.filter(p => p._id !== productId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: 0, oldPrice: 0, category: 'watches', subCategory: '',
      gender: 'unisex', stock: 0, featured: false, isActive: true, hsnCode: '',
      brand: '', quality: '', tags: [], images: [], video: '',
      metaTitle: '', metaKeywords: '', metaDescription: ''
    });
    setEditingProduct(null);
    setActiveTab("general");
    setTagsInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 gap-0">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {editingProduct ? 'Update product details' : 'Create a new product listing'}
                </p>
              </div>
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
                        <label className="text-sm font-semibold text-gray-700">New Price ($) <span className="text-red-500">*</span></label>
                        <Input type="number" name="price" value={formData.price} onChange={handleInputChange} className="bg-gray-50 border-gray-200" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Old Price ($)</label>
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
                          <SelectTrigger className="bg-gray-50 border-gray-200"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="watches">Watches</SelectItem>
                            <SelectItem value="shoes">Shoes</SelectItem>
                            <SelectItem value="t-shirts">T-Shirts</SelectItem>
                            <SelectItem value="shirts">Shirts</SelectItem>
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
                          {formData.images?.map((url, i) => (
                            <div key={i} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                              <img src={url} alt={`Preview ${i}`} className="w-full h-24 object-cover" />
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
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold text-gray-900">All Products</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-8 bg-gray-50 border-gray-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="pl-6">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => (
                  <TableRow key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <TableCell className="pl-6"><img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover rounded-md bg-gray-100 border border-gray-200" /></TableCell>
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell className="capitalize text-gray-500">{p.category}</TableCell>
                    <TableCell className="text-gray-500">{p.brand || '-'}</TableCell>
                    <TableCell className="font-medium text-gray-900">${p.price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                        {p.stock} in stock
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2 pr-6">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;