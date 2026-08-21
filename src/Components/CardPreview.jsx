import { useEffect } from 'react';
import Button from './Button';

const CardPreview = ({ src, title, description, websiteLink, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[80vw] max-h-[80vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-3 right-3 flex items-center justify-center size-9 rounded-full bg-blue-950 text-white text-xl leading-none cursor-pointer hover:opacity-85"
        >
          &times;
        </button>

        <div className="h-64 sm:h-96 overflow-hidden rounded-t-xl">
          <img
            src={src}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex flex-col items-center text-center gap-4 p-6">
          <h2 className="text-3xl text-blue-950 font-bold">{title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
          <Button websiteLink={websiteLink} />
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
