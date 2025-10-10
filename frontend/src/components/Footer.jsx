// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import paymentCard from '/src/assets/payment.png';

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${className}`}
  >
    {children}
  </button>
);

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState('');
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const emailValidation = () =>
    String(emailInfo)
      .toLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);

  const handleSubscription = () => {
    if (!emailInfo) {
      setErrMsg('Please provide an Email!');
    } else if (!emailValidation(emailInfo)) {
      setErrMsg('Please give a valid Email!');
    } else {
      setSubscription(true);
      setErrMsg('');
      setEmailInfo('');
    }
  };

  const categories = ["pants", "t-shirts", "shorts","jackets", "ethnic_wear", "kurtis", "indo_western", "lehenga_choli","sets&suits", "footwear","accesories","bags"];

  const formatCategory = (slug) => {
    return slug
      .replace(/_/g, ' ')
      .replace(/&/g, ' & ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const firstHalf = categories.slice(0, 6);
  const secondHalf = categories.slice(6);

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 order-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">KidoTrendz</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Discover premium quality products with exceptional service. Your
              trusted shopping destination for modern lifestyle essentials.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14.01-7.496 14.01-13.986 0-.21 0-.42-.015-.63.962-.695 1.8-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="order-3 md:order-2">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Shop', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(' ', '')}`}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 block py-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="order-2 md:order-3 lg:order-3">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ul className="space-y-2">
                {firstHalf.map((slug) => (
                  <li key={slug}>
                    <a
                      href={`/shop?category=${slug}`}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 block py-1"
                    >
                      {formatCategory(slug)}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {secondHalf.map((slug) => (
                  <li key={slug}>
                    <a
                      href={`/shop?category=${slug}`}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 block py-1"
                    >
                      {formatCategory(slug)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="order-4 md:order-4 lg:order-4 md:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Stay Updated</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            {subscription ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-700 text-sm font-medium">
                  ✓ Successfully subscribed!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={emailInfo}
                  onChange={(e) => setEmailInfo(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all duration-200"
                />
                {errMsg && (
                  <p className="text-red-500 text-xs mt-1 animate-pulse">{errMsg}</p>
                )}
                <Button
                  onClick={handleSubscription}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg"
                >
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-gray-500 text-sm text-center sm:text-left">© 2025 KidoTrendz. All rights reserved.</p>
            <div className="flex items-center gap-4 order-3 sm:order-2">
              <span className="text-gray-500 text-sm">We accept:</span>
              <img
                src={paymentCard}
                alt="Payment methods"
                className="h-8 object-contain opacity-60"
              />
            </div>
            <div className="flex gap-4 order-2 sm:order-3 justify-center sm:justify-end">
              {['Privacy Policy', 'Terms of Service'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;