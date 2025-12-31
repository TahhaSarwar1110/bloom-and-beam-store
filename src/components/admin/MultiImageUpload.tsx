import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface MultiImageUploadProps {
  bucket: string;
  currentUrls: string[];
  onImagesChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUpload({
  bucket,
  currentUrls,
  onImagesChange,
  label = 'Additional Images',
  maxImages = 10
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - currentUrls.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...currentUrls, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newUrls = currentUrls.filter((_, index) => index !== indexToRemove);
    onImagesChange(newUrls);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Image Grid */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {currentUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {currentUrls.length < maxImages && (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('multi-image-upload')?.click()}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Add Images ({currentUrls.length}/{maxImages})
              </>
            )}
          </Button>
          <input
            id="multi-image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      )}

      {currentUrls.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No additional images yet</p>
        </div>
      )}
    </div>
  );
}