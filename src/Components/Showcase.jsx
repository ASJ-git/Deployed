import WebsiteCard from './WebsiteCard';
import websites from '../Utilities/Websites.js';
import Pagination from './Pagination.jsx';

const postsPerPage = 6;

const Showcase = ({ currentPage, setCurrentPage }) => {
  const lastPage = currentPage * postsPerPage;
  const firstPage = lastPage - postsPerPage;
  const currentPost = websites.slice(firstPage, lastPage);
  return (
    // Showcase.jsx
    <div className="flex flex-col flex-grow">
      <div
        id="showcase"
        className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-[90%] max-w-[1366px] mx-auto pb-10 pt-20"
      >
        {currentPost.map((website) => (
          <WebsiteCard
            key={website.title}
            src={website.src}
            title={website.title}
            description={website.description}
            websiteLink={website.websiteLink}
          />
        ))}
      </div>

      <div className="mt-auto py-6 flex justify-center">
        <Pagination
          totalPosts={websites.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Showcase;