import Button from './Button';

const Hero = () => {
  return (
    <section className="bg-blue-400">
      <main className="flex flex-col gap-4 justify-center items-center text-center max-w-3xl container mx-auto text-white p-5  ">
        <h1 className="text-4xl md:text-6xl  ">
          A portfolio of projects, built and shipped.
        </h1>
        <p className="md:text-xl">
          Real products I've designed, built, and deployed from scratch,
          each one crafted with care and built to last.
        </p>
      </main>
    </section>
  );
};

export default Hero;
