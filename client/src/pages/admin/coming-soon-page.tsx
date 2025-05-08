import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import ComingSoonForm from "@/components/admin/coming-soon-form";
import Loader from "@/components/loader";
import { Product } from "@shared/schema";

export default function ComingSoonPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: comingSoonProducts, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["/api/coming-soon-products"],
    throwOnError: false,
  });
  
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
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
                      </tr>
                    </thead>
                    <tbody>
                      {comingSoonProducts && comingSoonProducts.length > 0 ? (
                        comingSoonProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={product.imageUrls[0]} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded"
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
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
                            src={product.imageUrls[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
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
                          <div className="flex justify-between items-center">
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