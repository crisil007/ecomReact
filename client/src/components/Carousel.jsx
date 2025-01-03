import React, { useState, useEffect } from 'react';

const FloatingCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const offerItems = [
        { message: 'Get 10% Cashback on orders above $100!' },
        { message: 'Free Delivery on your first 3 orders!' },
        { message: 'Exclusive: 20% off for members.' },
        { message: 'Buy 1 Get 1 Free on select items!' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % offerItems.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [offerItems.length]);

    return (
        <div className="w-full bg-yellow-400 text-black py-2 text-center shadow-lg">
            <p className="text-sm font-semibold">{offerItems[currentIndex].message}</p>
        </div>
    );
};

const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselItems = [
        { image: '/images/caro1.jpg', title: 'Special Offer 1', description: 'Big sale on fashion items.' },
        { image: '/images/caro4.jpg', title: 'Special Offer 2', description: 'Limited time offer for electronics.' },
        { image: '/images/image3.jpg', title: 'Special Offer 3', description: 'Explore new arrivals in home decor.' },
        { image: '/images/image4.jpg', title: 'Special Offer 4', description: 'Exclusive deals for members.' },
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden mt-16">
            {/* Adjusted margin-top to account for fixed navbar */}
            <FloatingCarousel />

            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {carouselItems.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-80 lg:h-96 xl:h-[500px] relative">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <h2 className="text-white text-2xl font-semibold">{item.title}</h2>
                            <p className="text-white text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
                onClick={handlePrev}
            >
                &#10094;
            </button>

            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
                onClick={handleNext}
            >
                &#10095;
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-500'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default CarouselComponent;
