import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Pencil, Eye } from "lucide-react";
import ComingSoonForm from "@/components/admin/coming-soon-form";
import Loader from "@/components/ui/loader";
import { Product } from "@shared/schema";
import { normalizeImageUrl } from "@/lib/imageUtils";

export default function ComingSoonPage() {
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: comingSoonProducts, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["/api/coming-soon-products"],
    throwOnError: false,
  });
  
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };
  
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  
  if (isLoading) return <Loader />;
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Error loading coming soon products</h2>
          <p>There was a problem loading the data. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Coming Soon Products - Admin | Cloud9wear</title>
      </Helmet>
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Coming Soon Products</h1>
          
          {/* Create Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Coming Soon Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Coming Soon Product</DialogTitle>
                <DialogDescription>
                  Add a new product to the coming soon section. It will be displayed as "Coming Soon" and not available for purchase until the release date.
                </DialogDescription>
              </DialogHeader>
              <ComingSoonForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
          
          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Coming Soon Product</DialogTitle>
                <DialogDescription>
                  Update your coming soon product details. Changes will be immediately reflected on the storefront.
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <ComingSoonForm 
                  product={selectedProduct}
                  isEditing={true}
                  onSuccess={handleEditSuccess}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Coming Soon Products</CardTitle>
            <CardDescription>
              Manage products that are not yet released but will be coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Release Date</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comingSoonProducts && comingSoonProducts.length > 0 ? (
                        comingSoonProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={normalizeImageUrl(product.imageUrls[0])} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    console.error('Coming soon product list image failed to load:', e.currentTarget.src);
                                    e.currentTarget.src = 'https://via.placeholder.com/100?text=Product';
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">₵{product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">
                              {'releaseDate' in product && product.releaseDate ? (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  {new Date(product.releaseDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              ) : 'Not set'}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="bg-black text-white hover:bg-[#ef0c11]">
                                Coming Soon
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-gray-600 hover:text-[#ef0c11]"
                                  title="Edit"
                                  onClick={() => handleEditClick(product)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-gray-600 hover:text-[#ef0c11]"
                                  title="View details"
                                  onClick={() => window.open(`/products/${product.id}`, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-gray-500">
                            No coming soon products found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="grid">
                {comingSoonProducts && comingSoonProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comingSoonProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="relative h-48">
                          <img 
                            src={normalizeImageUrl(product.imageUrls[0])} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Coming soon product grid image failed to load:', e.currentTarget.src);
                              e.currentTarget.src = 'https://via.placeholder.com/300?text=Coming+Soon';
                            }}
                          />
                          <Badge className="absolute top-2 right-2 bg-black text-white hover:bg-[#ef0c11]">
                            Coming Soon
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold">₵{product.price.toFixed(2)}</span>
                            {'releaseDate' in product && product.releaseDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {new Date(product.releaseDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 border-t pt-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 p-0 px-2 text-gray-600 hover:text-[#ef0c11]"
                              onClick={() => handleEditClick(product)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 p-0 px-2 text-gray-600 hover:text-[#ef0c11]"
                              onClick={() => window.open(`/products/${product.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500">
                    <div className="mb-2">No coming soon products found</div>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Coming Soon Product
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}