import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Upload, Loader2 } from "lucide-react";

interface AddEquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EQUIPMENT_CATEGORIES = [
  "Tractors",
  "Harvesters",
  "Tillers",
  "Sprayers",
  "Seeders",
  "Irrigation",
  "Transport",
  "Other",
];

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
  "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
  "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
  "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

export const AddEquipmentForm = ({
  isOpen,
  onClose,
  onSuccess,
}: AddEquipmentFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    district: "",
    location: "",
    specifications: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("equipment-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("equipment-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to list equipment");
      return;
    }

    if (!formData.name || !formData.category || !formData.pricePerDay || !formData.district) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      // Parse specifications into array
      const specifications = formData.specifications
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const { error } = await supabase.from("equipment").insert({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price_per_day: parseFloat(formData.pricePerDay),
        district: formData.district,
        location: formData.location,
        specifications: specifications.length > 0 ? specifications : null,
        image_url: imageUrl,
        owner_id: user.id,
        is_available: true,
      });

      if (error) throw error;

      toast.success("Equipment listed successfully!");
      
      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        pricePerDay: "",
        district: "",
        location: "",
        specifications: "",
      });
      setImageFile(null);
      setImagePreview(null);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error listing equipment:", error);
      toast.error("Failed to list equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            List Your Equipment for Rental
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              placeholder="e.g., John Deere 5050D Tractor"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your equipment, its condition, and any special features..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Price per Day */}
          <div className="space-y-2">
            <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
            <Input
              id="pricePerDay"
              type="number"
              placeholder="e.g., 2500"
              value={formData.pricePerDay}
              onChange={(e) =>
                setFormData({ ...formData, pricePerDay: e.target.value })
              }
              required
              min="1"
            />
          </div>

          {/* District */}
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={formData.district}
              onValueChange={(value) =>
                setFormData({ ...formData, district: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {MAHARASHTRA_DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location / Address</Label>
            <Input
              id="location"
              placeholder="e.g., Near Bus Stand, Baramati"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <Label htmlFor="specifications">
              Specifications (comma-separated)
            </Label>
            <Input
              id="specifications"
              placeholder="e.g., 50 HP, Power Steering, 4WD"
              value={formData.specifications}
              onChange={(e) =>
                setFormData({ ...formData, specifications: e.target.value })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Equipment Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span>Click to upload image</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Listing Equipment...
              </>
            ) : (
              "List Equipment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
