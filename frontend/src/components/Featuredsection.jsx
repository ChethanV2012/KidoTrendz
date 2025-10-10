import { useState, useRef, useEffect } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { BiSupport } from 'react-icons/bi';
import { MdOutlinePayment } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Container from './Container';

const FeaturedSection = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const itemRefs = useRef([]);

  const handleServiceClick = (service, index) => {
    console.log('Opening popup for:', service.title); // Debug log
    setSelectedService(service);
    setSelectedIndex(index);
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Closing popup'); // Debug log
    setSelectedService(null);
    setSelectedIndex(null);
  };

  const handleShopNow = () => {
    console.log('Shop Now clicked - Perform action here (e.g., show message or update state)');
    alert('Redirecting to shop section (simulated) - Add your logic here!');
    handleClose(); // Close popup
  };

  // Handle outside click to close popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedService && !itemRefs.current[selectedIndex]?.contains(e.target)) {
        console.log('Clicked outside, closing popup');
        handleClose(e);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedService, selectedIndex]);

  const services = [
    {
      title: 'Free Delivery',
      subtitle: 'Free shipping on all orders over Rs. 500',
      icon: <TbTruckDelivery />,
      details: {
        description:
          'Enjoy free standard shipping on all orders over Rs. 500. We partner with reliable courier services to ensure your products reach you safely and on time.',
        features: [
          'Free shipping on orders Rs. 500+',
          'Standard delivery: 2-3 Hrs',
          'Express delivery available',
          'Real-time tracking',
          'Secure packaging',
        ],
      },
    },
    {
      title: 'Easy Returns',
      subtitle: '7-days return guarantee',
      icon: <HiOutlineCurrencyDollar />,
      details: {
        description:
          'Not satisfied with your purchase? No problem! Our hassle-free return policy allows you to return any item within 7 days of purchase.',
        features: [
          '7-days return window',
          'Full refund guarantee',
          'Free return shipping',
          'Easy online return process',
          'No restocking fees',
        ],
      },
    },
    {
      title: '24/7 Support',
      subtitle: 'Expert support anytime',
      icon: <BiSupport />,
      details: {
        description:
          'Our dedicated customer support team is available 24/7 to assist you with any questions, concerns, or issues you may have.',
        features: [
          'Round-the-clock availability',
          'Live chat support',
          'Email and phone support',
          'Expert product guidance',
          'Order tracking assistance',
        ],
      },
    },
    {
      title: 'Secure Payment',
      subtitle: '100% secure transactions',
      icon: <MdOutlinePayment />,
      details: {
        description:
          'Shop with confidence knowing that all your transactions are protected by industry-leading security measures and encryption technology.',
        features: [
          'SSL encryption',
          'Multiple payment options',
          'Fraud protection',
          'PCI DSS compliance',
          'Secure checkout process',
        ],
      },
    },
  ];

  return (
    <section className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {services.map((item, index) => (
            <div
              key={index}
              ref={el => (itemRefs.current[index] = el)}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
              onClick={() => handleServiceClick(item, index)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl text-white">{item.icon}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                  {item.subtitle}
                </p>
              </div>

              {selectedService && selectedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full transform translate-y-4">
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MdClose className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-2xl text-white">{selectedService.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedService.title}</h3>
                        <p className="text-sm text-gray-500">{selectedService.subtitle}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed mb-4">{selectedService.details.description}</p>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <ul className="list-disc pl-3 text-gray-600 space-y-2">
                        {selectedService.details.features.map((feature, idx) => (
                          <li key={idx} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleShopNow}
                        className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedSection;