import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";
//import banner5 from "../assets/banner5.avif";

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const sliderRef = useRef(null);
 
  useEffect(() => {
    setBannerData([
      {
        image: banner1,  
      },
      {
        image: banner2, 
      },
      {
        image: banner3,  
      },
      {
        image: banner4,  
      },
    ]);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    cssEase: "linear",
    beforeChange: (prev, next) => setDotActive(next),
    appendDots: dots => (
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ul className="flex items-center gap-2 sm:gap-3">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div
        className={`cursor-pointer transition-all duration-300 ${i === dotActive
          ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white rounded-full"
          : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 rounded-full hover:bg-white/75"
          }`}
      />
    ),
    responsive: [
      {
        breakpoint: 640, // sm
        settings: {
          fade: true,
          autoplaySpeed: 3000,
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          fade: false,
          autoplaySpeed: 3500,
          appendDots: dots => (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <ul className="flex items-center gap-2">{dots}</ul>
            </div>
          ),
          customPaging: i => (
            <div
              className={`cursor-pointer transition-all duration-300 ${i === dotActive
                ? "w-6 h-1.5 bg-white rounded-full"
                : "w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/75"
                }`}
            />
          ),
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          fade: true,
          autoplaySpeed: 4000,
        },
      },
    ],
  };

  return (
    <div
      className="w-full h-[60vh] sm:h-[65vh] md:h-[70vh] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] max-h-[600px] sm:max-h-[650px] md:max-h-[700px] relative overflow-hidden group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((item, index) => (
          <div 
            key={index} 
            className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] max-h-[600px] sm:max-h-[650px] md:max-h-[700px] bg-black"
          >
            <img
              src={item?.image || 'https://via.placeholder.com/1200x600?text=Banner+Image'}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x600?text=Error+Loading'; }}
            />
          </div>
        ))}
      </Slider>
      {/* Navigation Arrows - Hide on mobile */}
      <div className={`hidden sm:flex absolute inset-y-0 left-0 flex items-center z-20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="ml-2 sm:ml-4 p-2 sm:p-3 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 rounded-full group shadow-lg"
          aria-label="Previous slide"
        >
          <HiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
      <div className={`hidden sm:flex absolute inset-y-0 right-0 flex items-center z-20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="mr-2 sm:mr-4 p-2 sm:p-3 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 rounded-full group shadow-lg"
          aria-label="Next slide"
        >
          <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

export default Banner;