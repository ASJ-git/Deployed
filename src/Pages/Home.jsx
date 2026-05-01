import Footer from '../Components/Footer';
import Hero from '../Components/Hero';
import Navbar from '../Components/Navbar';
import Showcase from '../Components/Showcase';

const Home = () => {
  return (
    // Home.jsx
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <main className="flex-grow flex flex-col">
        <Showcase />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
