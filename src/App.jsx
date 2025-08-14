import React, { useState, useEffect } from 'react';
import BunnyRive from "./components/BunnyRive";

// THE FIX #1: Import assets to get their final URLs from Vite.
// The `?url` for the .riv file is a good practice to ensure we just get the URL string.
import pebbleRiveFile from '/pebble.riv?url';
import necosmicFont from '/fonts/Necosmic.woff2';
import pixeloidFont from '/fonts/PixeloidSans.woff2';


// --- Main App Component ---
export default function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // This effect manages custom fonts, the mouse animation, and now detects touch devices.
  useEffect(() => {
    // FONT SETUP
    const style = document.createElement('style');
    // THE FIX #2: Use the imported font variables in the style tag.
    style.innerHTML = `
      @font-face {
        font-family: 'Necosmic';
        src: url('${necosmicFont}') format('woff2');
        font-weight: normal; font-style: normal; font-display: swap;
      }
      @font-face {
        font-family: 'Pixeloid Sans';
        src: url('${pixeloidFont}') format('woff2');
        font-weight: normal; font-style: normal; font-display: swap;
      }
      .font-necosmic { font-family: 'Necosmic', sans-serif; }
      .font-pixeloid { font-family: 'Pixeloid Sans', sans-serif; }
    `;
    document.head.appendChild(style);
    
    // Check for touch-only device once on mount
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);

    // MOUSE MOVE HANDLER for desktop parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const offsetX = (clientX - innerWidth / 2) / (innerWidth / 2);
      const offsetY = (clientY - innerHeight / 2) / (innerHeight / 2);
      const intensity = 20; // Slightly increased for more premium feel
      setTransform({ x: -offsetX * intensity, y: -offsetY * intensity });
    };

    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('mousemove', handleMouseMove);
    }
    
    // BODY SCROLL LOCK for when the mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.head.removeChild(style);
      document.body.style.overflow = 'unset';
      if (window.matchMedia('(hover: hover)').matches) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMenuOpen]);
  
  const menuLinks = [
    { name: 'PEBBLE LABS', href: '#' },
    { name: 'PEBBLE AI', href: '#' },
    { name: 'MORE APPS', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 relative overflow-hidden antialiased">

      {/* ===== Header ===== */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
            <a href="#" className="text-xl font-bold tracking-widest font-pixeloid text-red-600 z-50 hover:text-red-700 transition-colors duration-300">PEBBLE</a>
          <div className="hidden md:flex absolute inset-x-0 items-center justify-center gap-8 lg:gap-16 text-lg lg:text-3xl tracking-widest text-red-600 font-pixeloid">
            {menuLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-red-700 transition-colors duration-300 ease-in-out">{link.name}</a>
            ))}
          </div>
          <div className="md:hidden z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 w-8 h-8 flex flex-col justify-around" aria-label="Toggle menu">
                <span className={`block w-full h-0.5 bg-red-600 rounded transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`}></span>
                <span className={`block w-full h-0.5 bg-red-600 rounded transition-opacity duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></span>
                <span className={`block w-full h-0.5 bg-red-600 rounded transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Mobile Menu Overlay ===== */}
      <div className={`fixed top-0 right-0 h-full w-full z-40 bg-white/95 backdrop-blur-md p-8 pt-24 transition-all duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex flex-col">
          {menuLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <a href={link.href} onClick={() => setIsMenuOpen(false)} className="py-5 text-3xl text-left tracking-widest text-red-600 font-pixeloid hover:text-red-700 transition-colors duration-300">
                {link.name}
              </a>
              {index < menuLinks.length - 1 && <div className="w-full border-t border-red-600/10"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* ===== DESKTOP-ONLY LAYOUT ===== */}
      <div className="hidden md:block w-full h-screen relative">
        <div className="relative w-full h-full -translate-y-10">
            <h1 className="absolute inset-0 flex items-center justify-center font-necosmic text-[22vw] lg:text-[20vw] font-black text-red-600 leading-none tracking-tighter pointer-events-none drop-shadow-md">
              PEBBLE
            </h1>
            <div 
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
                <div className="w-[360px] h-[360px] lg:w-[400px] lg:h-[400px] drop-shadow-2xl">
                    {/* THE FIX #3: Use the imported variable for the src prop */}
                    <BunnyRive src={pebbleRiveFile} stateMachine="pebble" width={400} height={400} isTouchDevice={isTouchDevice} />
                </div>
            </div>
            <p className="absolute inset-x-0 top-1/2 w-full text-center text-3xl font-pixeloid lg:text-4xl text-red-600 tracking-widest pointer-events-none mt-[130px] lg:mt-[130px] drop-shadow-sm">
                Your Pocket Companion
            </p>
            <div className="absolute bottom-16 left-0 right-0 z-10 flex flex-col items-center">
                <a href="#" className="font-pixeloid bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-10 rounded-full text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-600/40 hover:shadow-red-600/60">
                    SAY HELLO
                </a>
                <div className="mt-6 flex items-center gap-4">
                    <a href="#" className="hover:opacity-80 transition-opacity duration-300"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-12 drop-shadow-md"/></a>
                    <a href="#" className="hover:opacity-80 transition-opacity duration-300"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on the App Store" className="h-12 drop-shadow-md"/></a>
                </div>
            </div>
        </div>
      </div>
      
      {/* ===== MOBILE-ONLY LAYOUT ===== */}
      <div className="md:hidden w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
          <div className="w-[240px] h-[240px] drop-shadow-2xl">
              {/* THE FIX #4: Use the imported variable for the src prop here too */}
              <BunnyRive src={pebbleRiveFile} stateMachine="pebble" width={240} height={240} isTouchDevice={isTouchDevice} />
          </div>
          <div className="text-center mt-4">
            <h1 className="font-necosmic text-7xl font-black text-red-600 leading-none tracking-tighter drop-shadow-md">
              PEBBLE
            </h1>
            <p className="text-xl text-red-600 tracking-widest mt-1 font-pixeloid drop-shadow-sm">
                Your Pocket Companion
            </p>
          </div>
          <a href="#" className="font-pixeloid mt-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-8 rounded-full text-base flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-600/40 hover:shadow-red-600/60">
              SAY HELLO
          </a>
          <div className="mt-6 flex items-center gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity duration-300"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-10 drop-shadow-md"/></a>
              <a href="#" className="hover:opacity-80 transition-opacity duration-300"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="Download on the App Store" className="h-10 drop-shadow-md"/></a>
          </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto">
            <p className="text-center text-xs text-gray-500 tracking-wide">© 2025 Pebble Labs Inc. &nbsp;&nbsp;·&nbsp;&nbsp; <a href="#" className="hover:text-gray-700 transition-colors">Contact Us</a> &nbsp;&nbsp;·&nbsp;&nbsp; <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a></p>
        </div>
      </footer>

    </div>
  );
}