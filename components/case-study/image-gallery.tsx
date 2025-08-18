import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <Card
          key={index}
          className="overflow-hidden transition-shadow hover:shadow-lg"
        >
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                loading="lazy"
              />
            </AspectRatio>
            {image.caption && (
              <div className="p-4">
                <p className="text-muted-foreground text-center text-sm">
                  {image.caption}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
