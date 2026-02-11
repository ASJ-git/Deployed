const Navbar = () => {
  return (
    <div className="container mx-auto my-5 ">
      <nav className="flex flex-col justify-between items-center gap-2 px-5 sm:flex-row">
        <div className="flex justify-center items-center cursor-pointer">
          <img
            src="/nav-brand.jpg"
            alt="logo"
            className="size-20 rounded-full"
          />
          <div className="text-blue-900">
            <h1 className="font-bold text-3xl">DEPLOYED</h1>
            <p className="text-xl">By ASJ</p>
          </div>
        </div>
        {/* <div className="links">
          <ul className="links-hover flex gap-2 font-bold md:gap-10">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About Me</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
          </ul>
        </div> */}
      </nav>
    </div>
  );
};

export default Navbar;
