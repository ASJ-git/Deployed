import React from 'react';
const Pagination = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }
  return (
    <div>
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(page);
              document
                .getElementById('showcase')
                .scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-1.5 cursor-pointer mx-2 text-white text-2xl ${
              page === currentPage ? 'bg-blue-500 font-bold' : 'bg-blue-900'
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
