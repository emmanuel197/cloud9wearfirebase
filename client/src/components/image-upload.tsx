import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploadProps {
  onImageAdded: (imageUrl: string) => void;
  translations: {
    imageUrl: string;
    uploadImage: string;
    addImage: string;
    orEnterUrl: string;
    selectImage: string;
    urlTab: string;
    uploadTab: string;
    uploading: string;
  };
}

export default function ImageUpload({ onImageAdded, translations }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<string>("url");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAddUrlImage = () => {
    if (!imageUrl.trim()) return;
    onImageAdded(imageUrl);
    setImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await apiRequest(
        "POST", 
        "/api/upload/product-image", 
        formData, 
        { isFormData: true }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      // Add the new image URL to the form
      onImageAdded(data.url);
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });

      // Reset file input
      e.target.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-2">
        <TabsTrigger value="url">{translations.urlTab}</TabsTrigger>
        <TabsTrigger value="upload">{translations.uploadTab}</TabsTrigger>
      </TabsList>
      <TabsContent value="url" className="space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder={translations.imageUrl}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button 
            type="button" 
            onClick={handleAddUrlImage}
            disabled={!imageUrl.trim()}
          >
            <Link className="h-4 w-4 mr-2" />
            {translations.addImage}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="upload">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {isUploading && (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>{translations.uploading}...</span>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}