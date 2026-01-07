import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import React, { useRef, useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";
import lgZoom from "lightgallery/plugins/zoom";

export interface GalleryItem {
  size: number;
  venueId: number | string;
  venueMediaId: number | string;
  src: string;
  thumbnail?: string;
  poster?: string;
  type?: "image" | "video";
  alt?: string;
  subHtml?: string;
}

interface GalleryProps {
  data: GalleryItem[];
  plugins?: any[];
  speed?: number;
  elementClassNames?: string;
  deleteImage?: (
    venueId: number | string,
    venueMediaId: number | string
  ) => void;
}

const ErrorThumbnail: React.FC<{ item: GalleryItem; className: string }> = ({
  item,
  className,
}) => (
  <div
    className={`${className} bg-gray-100 border border-gray-300 flex items-center justify-center min-h-32`}
  >
    <div className="text-center p-4">
      <svg
        className="w-8 h-8 text-gray-400 mx-auto mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <p className="text-sm text-gray-600 font-medium">File not found</p>
      <p className="text-xs text-gray-500 mt-1">
        {item.alt || "Media unavailable"}
      </p>
    </div>
  </div>
);

export const Gallery: React.FC<GalleryProps> = ({
  data,
  plugins = [lgThumbnail, lgVideo, lgZoom],
  speed = 500,
  elementClassNames = "flex item-center flex-wrap gap-3",
  deleteImage,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const galleryRef = useRef<any>(null);
  const deleteClickRef = useRef<boolean>(false);

  const handleImageError = (itemKey: string) => {
    setImageErrors((prev) => new Set([...prev, itemKey]));
  };

  const handleImageLoad = (itemKey: string) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemKey);
      return newSet;
    });
  };

  const handleDeleteClick = (
    venueId: number | string,
    venueMediaId: number | string
  ) => {
    deleteClickRef.current = true;

    if (deleteImage) {
      deleteImage(venueId, venueMediaId);
    }

    // Reset the flag after a delay
    setTimeout(() => {
      deleteClickRef.current = false;
    }, 500);
  };

  const handleImageClick = (e: React.MouseEvent, item: GalleryItem) => {
    e.preventDefault();

    // Check if this was triggered by delete button click
    if (deleteClickRef.current) {
      return;
    }

    // Open gallery manually
    const validItems = data.filter(
      (dataItem) =>
        !imageErrors.has(`${dataItem.venueId}-${dataItem.venueMediaId}`)
    );
    const itemIndex = validItems.findIndex(
      (dataItem) =>
        dataItem.venueId === item.venueId &&
        dataItem.venueMediaId === item.venueMediaId
    );

    if (itemIndex >= 0 && galleryRef.current) {
      galleryRef.current.openGallery(itemIndex);
    }
  };

  // Filter out error items for the gallery
  const validItems = data.filter(
    (item) => !imageErrors.has(`${item.venueId}-${item.venueMediaId}`)
  );

  return (
    <div className="relative">
      {/* Hidden LightGallery for programmatic control */}
      <div style={{ display: "none" }}>
        <LightGallery
          onInit={(detail) => {
            galleryRef.current = detail.instance;
          }}
          plugins={plugins}
          speed={speed}
          videojs={true}
          videojsOptions={{
            fluid: true,
            responsive: true,
            preload: "none",
            controls: true,
          }}
        >
          {validItems.map((item, idx) => (
            <a
              key={`gallery-${item.venueId}-${item.venueMediaId}-${idx}`}
              href={item.src}
              data-sub-html={item.subHtml}
            >
              <img src={item.thumbnail || item.src} alt={item.alt || "Image"} />
            </a>
          ))}
        </LightGallery>
      </div>

      {/* Visible gallery items */}
      <div className={elementClassNames}>
        {validItems.map((item, idx) => {
          const imageClass = "w-full h-28 object-contain cursor-pointer";
          const itemKey = `${item.venueId}-${item.venueMediaId}`;
          const thumbnailSrc = item.thumbnail || item.src;

          return (
            <div className="block text-center">
              <div
                key={`${itemKey}-${idx}`}
                className="relative border border-neutral-200 text-center group w-max p-0"
              >
                {/* Delete button - completely separate from gallery trigger */}
                <button
                  className="absolute right-2 top-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(item.venueId, item.venueMediaId);
                  }}
                  title="Delete image"
                  type="button"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Image - separate click handler */}
                <div
                  className="mx-auto"
                  onClick={(e) => handleImageClick(e, item)}
                >
                  <img
                    loading="lazy"
                    className={imageClass}
                    src={thumbnailSrc}
                    alt={item.alt || "Image"}
                    onError={() => handleImageError(itemKey)}
                    onLoad={() => handleImageLoad(itemKey)}
                  />
                </div>
              </div>
              {item.size && (
                <p className="text-[11px] text-gray-400">
                  {(item.size / 1024).toFixed(2)} Kb
                </p>
              )}
            </div>
          );
        })}

        {/* Error items displayed separately */}
        {data.map((item, idx) => {
          const imageClass = "w-full h-28 object-contain";
          const itemKey = `${item.venueId}-${item.venueMediaId}`;
          const hasError = imageErrors.has(itemKey);

          if (!hasError) return null;

          return (
            <div
              key={`error-${itemKey}-${idx}`}
              className="relative border border-neutral-200 text-center group"
            >
              {/* Delete button for error items */}
              <button
                className="absolute right-2 top-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(item.venueId, item.venueMediaId);
                }}
                title="Delete image"
                type="button"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <ErrorThumbnail item={item} className={imageClass} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ImageGalleryProps {
  data: GalleryItem[];
  plugins?: any[];
  speed?: number;
  elementClassNames?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  data,
  plugins = [lgThumbnail, lgVideo, lgZoom],
  speed = 500,
  elementClassNames = "inline",
}) => {
  return (
    <div className="masonry-image-gallery">
      <LightGallery
        elementClassNames={elementClassNames}
        plugins={plugins}
        speed={speed}
        videojs={true}
        videojsOptions={{
          fluid: true,
          responsive: true,
          preload: "none",
          controls: true,
        }}
      >
        {data.map((item, idx) => {
          const imageClass = "w-full mb-2";
          return (
            <a
              key={`${item.venueId}-${item.venueMediaId}-${idx}`}
              href={item.src}
              data-sub-html={item.subHtml}
              className="inline-block"
            >
              <img
                loading="lazy"
                className={imageClass}
                src={item.thumbnail || item.src}
                alt={item.alt || "Image"}
              />
            </a>
          );
        })}
      </LightGallery>
    </div>
  );
};

export interface VideoGalleryProps {
  data: GalleryItem[];
  onClick: (
    venueId: string | number,
    venueMediaId: string | number,
    poster?: string
  ) => void;
  handleDelete?: (e: string | number, v: string | number) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  data,
  onClick,
  handleDelete,
}) => {
  return (
    <div className="masonry-gallery">
      {data.map((item, idx) => {
        const imageClass = "  object-contain mb-2";
        return (
          // <a
          //   key={`${item.venueId}-${item.venueMediaId}-${idx}`}
          //   href={item.src}
          //   data-sub-html={item.subHtml}
          //   className="inline-block"
          // >
          <div className="relative min-w-96 group">
            <button
              className="absolute right-2 top-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete && handleDelete(item.venueId, item.venueMediaId);
              }}
              title="Delete image"
              type="button"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img
              key={idx}
              loading="lazy"
              className={imageClass}
              src={item.thumbnail || item.poster}
              alt={item.alt || "Image"}
              onClick={() =>
                onClick(
                  item.venueId,
                  item.venueMediaId,
                  item.thumbnail ?? item.poster
                )
              }
            />
          </div>
          // </a>
        );
      })}
    </div>
  );
};
