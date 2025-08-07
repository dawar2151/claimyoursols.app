// Create a new component called AnimatedBackground.js
export default function AnimatedBackground() {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute w-full h-full animated-grid"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-10">
          <h1 className="text-4xl font-bold">Blockchain Network</h1>
        </div>
      </div>
    );
  }
  