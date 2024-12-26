import React, { useState, useEffect } from 'react';

const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // List of images for the carousel
    const carouselItems = [
        {
            image: '/images/caro1.jpg',
            title: 'Special Offer 1',
            description: 'Big sale on fashion items.',
        },
        {
            image: '/images/caro4.jpg',
            title: 'Special Offer 2',
            description: 'Limited time offer for electronics.',
        },
        {
            image: '/images/image3.jpg',
            title: 'Special Offer 3',
            description: 'Explore new arrivals in home decor.',
        },
        {
            image: '/images/image4.jpg',
            title: 'Special Offer 4',
            description: 'Exclusive deals for members.',
        },
    ];

    // Go to the next slide
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Go to the previous slide
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        );
    };

    // Use effect to make the floating message loop like a carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change message every 3 seconds (you can adjust this)
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
            {/* Moving Floating Message */}
            <div className="absolute top-0 left-0 w-full flex overflow-hidden z-10">
                <div
                    className="flex transition-transform duration-3000 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`, // Move horizontally like a carousel
                    }}
                >
                    <div className="flex-shrink-0 w-full bg-yellow-400 p-3 text-center text-black font-semibold shadow-md">
                        <span>Hurry up! Big discounts on selected items today.</span>
                    </div>
                    <div className="flex-shrink-0 w-full bg-yellow-400 p-3 text-center text-black font-semibold shadow-md">
                        <span>Exclusive deals just for you this holiday season!</span>
                    </div>
                    <div className="flex-shrink-0 w-full bg-yellow-400 p-3 text-center text-black font-semibold shadow-md">
                        <span>Shop now and get an extra 10% off your purchase.</span>
                    </div>
                </div>
            </div>

            {/* Carousel content: sliding images */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`, // Move images horizontally
                }}
            >
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-full h-80 lg:h-96 xl:h-[500px] relative"
                    >
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

            {/* Left Navigation Button */}
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
                onClick={handlePrev}
            >
                &#10094;
            </button>

            {/* Right Navigation Button */}
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
                onClick={handleNext}
            >
                &#10095;
            </button>

            {/* Dots indicator */}
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
