import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-grow gap-4 justify-center items-center text-center max-w-3xl container mx-auto p-5">
        <h1 className="text-6xl md:text-8xl font-bold text-blue-900">404</h1>
        <p className="text-xl md:text-2xl text-blue-950">
          Page not found.
        </p>
        <p className="text-gray-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="button text-white font-bold py-2 px-5 inline-block bg-blue-950 rounded mt-4"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
