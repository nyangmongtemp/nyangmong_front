
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PetCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const pets = [
    {
      name: "골든 리트리버",
      description: "친근하고 활발한 성격의 대형견",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "페르시안 고양이",
      description: "우아하고 조용한 성격의 장모종",
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "코리아 숏헤어",
      description: "똑똑하고 독립적인 성격의 고양이",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "포메라니안",
      description: "작지만 용감한 성격의 소형견",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [pets.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + pets.length) % pets.length);
  };

  return (
    <div className="relative h-96 bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <img
            src={pets[currentSlide].image}
            alt={pets[currentSlide].name}
            className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-lg"
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {pets[currentSlide].name}
          </h3>
          <p className="text-gray-600 text-lg">
            {pets[currentSlide].description}
          </p>
        </div>
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {pets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-orange-500' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PetCarousel;
