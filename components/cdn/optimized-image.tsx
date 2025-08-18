/**
 * Optimized Image Component with CDN Integration
 * Leverages Next.js Image optimization with additional CDN strategies
 */

import Image, { ImageProps } from "next/image";
import {
  generateOptimizedImageUrl,
  getImageQuality,
  isAllowedImageSource,
  calculateOptimalImageSize,
} from "@/lib/cdn/optimization";

interface OptimizedImageProps extends Omit<ImageProps, "quality"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  context?: "thumbnail" | "gallery" | "hero" | "default";
  priority?: boolean;
  className?: string;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality,
  context = "default",
  priority = false,
  className,
  sizes,
  placeholder = "empty",
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  // Validate source URL
  if (!isAllowedImageSource(src)) {
    console.warn(`Image source not allowed: ${src}`);
    return null;
  }

  // Determine quality based on context if not explicitly set
  const imageQuality = quality || getImageQuality(context);

  // Calculate optimal dimensions if container size is provided
  const optimalSize =
    width && height
      ? calculateOptimalImageSize(Number(width), Number(height))
      : { width: Number(width) };

  // Generate responsive sizes if not provided
  const responsiveSizes =
    sizes ||
    (() => {
      if (context === "thumbnail") return "(max-width: 768px) 100vw, 200px";
      if (context === "hero") return "100vw";
      if (context === "gallery") return "(max-width: 768px) 100vw, 50vw";
      return "(max-width: 768px) 100vw, 800px";
    })();

  return (
    <Image
      src={src}
      alt={alt}
      width={optimalSize.width || width}
      height={optimalSize.height || height}
      quality={imageQuality}
      priority={priority}
      className={className}
      sizes={responsiveSizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{
        width: "100%",
        height: "auto",
        ...props.style,
      }}
      {...props}
    />
  );
}

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;

/**
 * Optimized Background Image Component
 * For decorative background images with CDN optimization
 */
interface OptimizedBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  quality?: number;
  priority?: boolean;
}

function OptimizedBackgroundImage({
  src,
  alt = "",
  className = "",
  children,
  quality = 75,
  priority = false,
}: OptimizedBackgroundImageProps) {
  if (!isAllowedImageSource(src)) {
    console.warn(`Background image source not allowed: ${src}`);
    return <div className={className}>{children}</div>;
  }

  const optimizedSrc = generateOptimizedImageUrl(src, { quality, width: 1920 });

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${optimizedSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      {/* Preload the background image if priority */}
      {priority && <link rel="preload" as="image" href={optimizedSrc} />}
      {children}
    </div>
  );
}

OptimizedBackgroundImage.displayName = "OptimizedBackgroundImage";

export { OptimizedBackgroundImage };

/**
 * Avatar Component with CDN Optimization
 * Specialized for profile/avatar images
 */
interface OptimizedAvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

function OptimizedAvatar({
  src,
  alt,
  size = 64,
  className = "",
  priority = false,
}: OptimizedAvatarProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      context="thumbnail"
      priority={priority}
      className={className}
      sizes={`${size}px`}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}

OptimizedAvatar.displayName = "OptimizedAvatar";

export { OptimizedAvatar };

/**
 * Hero Image Component with CDN Optimization
 * Specialized for large hero/banner images
 */
interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
}

function OptimizedHeroImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = true, // Heroes are typically above-the-fold
  overlay = false,
  children,
}: OptimizedHeroImageProps) {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width || 1920}
        height={height || 1080}
        context="hero"
        priority={priority}
        sizes="100vw"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {overlay && <div className="bg-opacity-40 absolute inset-0 bg-black" />}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

OptimizedHeroImage.displayName = "OptimizedHeroImage";

export { OptimizedHeroImage };

/**
 * Gallery Image Component with CDN Optimization
 * Specialized for image galleries with lightbox support
 */
interface OptimizedGalleryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}

function OptimizedGalleryImage({
  src,
  alt,
  width,
  height,
  className = "",
  onClick,
  loading = "lazy",
}: OptimizedGalleryImageProps) {
  return (
    <div
      className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 300}
        context="gallery"
        priority={loading === "eager"}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

OptimizedGalleryImage.displayName = "OptimizedGalleryImage";

export { OptimizedGalleryImage };
