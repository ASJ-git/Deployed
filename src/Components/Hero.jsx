import Button from './Button';

const Hero = () => {
  return (
    <section className="bg-blue-400 ">
      <main className="flex flex-col gap-4 justify-center items-center text-center max-w-3xl container mx-auto text-white p-20  ">
        <h1 className="text-4xl md:text-6xl  ">
          A portfolio of my most successful projects, deployed and thriving.
        </h1>
        <p className="md:text-xl">
          Explore the projects I've built from the ground up, deployed
          successfully, and maintained with care. My work reflects a dedication
          to quality and a passion for creating impactful solutions.
        </p>
       </main>
    </section>
  );
};

export default Hero;
