import WebsiteCard from './WebsiteCard';
import websites from '../Utitlities/Websites.js';
import { useState } from 'react';
import Pagination from './Pagination.jsx';
const Showcase = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  const lastPage = currentPage * postsPerPage;
  const firstPage = lastPage - postsPerPage;
  const currentPost = websites.slice(firstPage, lastPage);
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-[90%] max-w-[1366px] mx-auto pb-10 pt-20">
      {currentPost.map((website) => (
        <WebsiteCard
          key={crypto.randomUUID()}
          src={website.src}
          title={website.title}
          description={website.description}
          websiteLink={website.websiteLink}
        />
      ))}
      <div className="lg:col-span-3 md:col-span-2 col-span-1 flex justify-center">
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
