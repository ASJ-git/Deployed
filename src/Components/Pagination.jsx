const Pagination = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }
  return (
    <div className="flex items-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => {
            setCurrentPage(page);
            document
              .getElementById('showcase')
              .scrollIntoView({ behavior: 'smooth' });
          }}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`cursor-pointer px-3 py-1 text-2xl transition-colors ${
            page === currentPage
              ? 'bg-blue-900 text-white font-bold border-b-2 border-[dodgerblue]'
              : 'text-blue-900 hover:text-[dodgerblue]'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
