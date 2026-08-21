import Button from './Button';
import CardPreview from './CardPreview';
import { useState } from 'react';

const isDev = import.meta.env.DEV;
const DEFAULT_IMAGE = '/default.svg';

const WebsiteCard = ({ src, title, description, websiteLink }) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_IMAGE);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const resolvedSrc =
    imgSrc === DEFAULT_IMAGE || isDev
      ? imgSrc
      : `/.netlify/images?url=${encodeURIComponent(imgSrc)}&w=760&fm=webp&q=75`;

  return (
    <>
      <div
        onClick={() => setIsPreviewOpen(true)}
        className="w-full rounded-b-xl border-1 border-gray-400 cursor-pointer"
      >
        <div className="h-80 overflow-hidden">
          <img
            src={resolvedSrc}
            onError={() => setImgSrc(DEFAULT_IMAGE)}
            alt={title}
            className="w-full h-full  object-cover object-top"
          />
        </div>
        <div className="flex flex-col items-center justify-between text-center p-5 h-50">
          <h1 className="text-2xl text-blue-950">{title}</h1>
          <p className="py-2 line-clamp-3">{description}</p>
          <Button websiteLink={websiteLink} />
        </div>
      </div>

      {isPreviewOpen && (
        <CardPreview
          src={resolvedSrc}
          title={title}
          description={description}
          websiteLink={websiteLink}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default WebsiteCard;
