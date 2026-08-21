import { useEffect, useRef } from 'react';

const Hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-amber-700/50">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/livewallpaper.mp4"
        poster="/video/livewallpaper-poster.jpg"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-blue-950/60" aria-hidden="true" />
      <main className="relative z-10 flex flex-col gap-6 justify-center items-center text-center max-w-3xl container mx-auto text-white px-5 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold">
          A portfolio of projects, built and shipped.
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="font-serif text-lg md:text-xl">
            Real products I've designed, built and deployed from scratch.
          </p>
          <span className="hero-divider h-px w-40" aria-hidden="true" />
          <p className="font-serif text-lg md:text-xl">
            Each one crafted with care and built to last.
          </p>
        </div>
      </main>
    </section>
  );
};

export default Hero;
