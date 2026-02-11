import Button from './Button';
const WebsiteCard = ({ src, title, description, websiteLink }) => {
  return (
    <div className="w-80 rounded-b-xl border-1 border-gray-400">
      <div className="h-80 overflow-hidden">
        <img
          src={src}
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
  );
};

export default WebsiteCard;
