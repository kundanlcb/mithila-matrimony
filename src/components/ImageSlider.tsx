import { useState } from 'react';

interface ImageSliderProps {
  images: string[];
  height?: string;
  borderRadius?: string;
}

export const ImageSlider = ({ images, height = '300px', borderRadius = '0' }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeImages = images.filter(img => img && img.trim() !== '');

  if (!safeImages || safeImages.length === 0) {
    return (
      <div style={{ width: '100%', height, backgroundColor: 'var(--bg-app)', borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>No Photo</span>
      </div>
    );
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events (like opening a profile modal)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius, overflow: 'hidden' }}>
      <img
        src={safeImages[currentIndex]}
        alt={`Profile Slide ${currentIndex + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease-in-out' }}
      />

      {safeImages.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              backdropFilter: 'blur(4px)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              backdropFilter: 'blur(4px)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            zIndex: 2
          }}>
            {safeImages.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: idx === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
