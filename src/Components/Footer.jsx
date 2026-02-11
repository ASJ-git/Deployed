const Footer = () => {
  return (
    <footer className=" flex flex-col items-center gap-5 bg-blue-950 text-white py-10 text-xl">
      <ul className="links-hover flex flex-col gap-4 justify-between items-center md:flex-row px-5 ">
        <li>
          <a href="https://www.linkedin.com/in/abrusu-sampson-junior-001020344?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://github.com/ASJ-git">Github</a>
        </li>
        <li>
          <a href="https://x.com/AbrusuSamp42087?t=-fiE79UuCcU27fCUibT70w&s=08">
            X
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/skam_gh?utm_source=qr&igsh=aWVpamt3N2g0eWN3">
            Instagram
          </a>
        </li>
      </ul>
      <h1>Copyright &copy; 2025 | ASJ</h1>
    </footer>
  );
};

export default Footer;
