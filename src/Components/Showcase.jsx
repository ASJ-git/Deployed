import WebsiteCard from './WebsiteCard';
import websites from '../Utitlities/Websites.js';
const Showcase = () => {
  return (
    <div className="grid container mx-auto py-20">
      {websites.map((website) => (
        <WebsiteCard
          key={crypto.randomUUID()}
          src={website.src}
          title={website.title}
          description={website.description}
          websiteLink={website.websiteLink}
        />
      ))}
    </div>
  );
};

export default Showcase;