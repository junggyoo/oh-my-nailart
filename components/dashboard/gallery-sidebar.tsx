"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: string;
  src: string;
  prompt: string;
}

interface GallerySidebarProps {
  images: GalleryImage[];
  onDownload?: (src: string, prompt: string) => void;
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function GallerySidebar({ images, onDownload }: GallerySidebarProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      {/* Floating sidebar - always visible */}
      <div className="fixed top-20 left-4 bottom-4 z-30 w-[260px] flex flex-col rounded-2xl border border-white/[0.08] bg-[#1a1a1a]/80 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
        {/* Liquid glass overlay effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute top-1/3 -right-10 h-40 w-40 rounded-full bg-orange-500/[0.04] blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-blue-500/[0.03] blur-3xl" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />
        </div>

        {/* Header */}
        <div className="relative flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
            <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white">My Gallery</h2>
            <p className="text-[10px] text-gray-500">{images.length} images</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Gallery grid */}
        <div className="relative flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">No images yet</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Generated images will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-white/[0.04]"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.08] z-10 pointer-events-none" />

                  <img
                    src={image.src}
                    alt={image.prompt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover overlay - download only */}
                  <div className="absolute inset-0 z-20 flex items-end justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {onDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(image.src, image.prompt);
                        }}
                        className="m-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
                      >
                        <DownloadIcon />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent rounded-b-2xl" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] cursor-default"
            >
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/[0.1]">
                <div className="absolute inset-0 bg-white/[0.02] pointer-events-none z-10" />
                <img
                  src={selectedImage.src}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 px-1">
                <p className="text-sm text-white/70 line-clamp-2">{selectedImage.prompt}</p>
                {onDownload && (
                  <button
                    onClick={() => onDownload(selectedImage.src, selectedImage.prompt)}
                    className="flex h-9 items-center gap-2 shrink-0 rounded-full bg-white/10 backdrop-blur-sm px-4 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    <DownloadIcon />
                    Download
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
