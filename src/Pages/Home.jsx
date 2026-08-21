import { useState } from 'react';
import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import Navbar from '../Components/Navbar';
import Showcase from '../Components/Showcase';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    // Home.jsx
    <div className="flex flex-col min-h-screen">
      <Navbar onLogoClick={() => setCurrentPage(1)} />
      <Hero />
      <main className="flex-grow flex flex-col">
        <Showcase currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
