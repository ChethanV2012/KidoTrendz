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

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">KidoTrendz</h3>
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.307.317 2.793.584.486.267.861.617 1.223 1.174.362.557.631 1.074.794 2.093.163 1.019.066 1.646.066 4.85s.012 3.831.066 4.85c.062 1.366.317 2.307.584 2.793.267.486.617.861 1.174 1.223.557.362 1.074.631 2.093.794 1.019.163 1.646.066 4.85.066s3.831-.012 4.85-.066c1.366-.062 2.307-.317 2.793-.584.486-.267.861-.617 1.223-1.174.362-.557.631-1.074.794-2.093.163-1.019.066-1.646.066-4.85s-.012-3.831-.066-4.85c-.062-1.366-.317-2.307-.584-2.793-.267-.486-.617-.861-1.174-1.223-.557-.362-1.074-.631-2.093-.794-1.019-.163-1.646-.066-4.85-.066s-3.831.012-4.85.066c-1.366.062-2.307.317-2.793.584-.486.267-.861.617-1.223 1.174-.362.557-.631 1.074-.794 2.093-.163 1.019-.066 1.646-.066 4.85s.012 3.831.066 4.85c.062 1.366.317 2.307.584 2.793.267.486.617.861 1.174 1.223.557.362 1.074.631 2.093.794 1.019.163 1.646.066 4.85.066s3.831-.012 4.85-.066c1.366-.062 2.307-.317 2.793-.584.486-.267.861-.617 1.223-1.174.362-.557.631-1.074.794-2.093.163-1.019.066-1.646.066-4.85s-.012-3.831-.066-4.85c-.062-1.366-.317-2.307-.584-2.793-.267-.486-.617-.861-1.174-1.223-.557-.362-1.074-.631-2.093-.794-1.019-.163-1.646-.066-4.85-.066-3.204 0-3.584-.012-4.85-.07-1.366-.062-2.307-.317-2.793-.584-.486-.267-.861-.617-1.223-1.174-.362-.557-.631-1.074-.794-2.093-.163-1.019-.066-1.646-.066-4.85 0-3.204.012-3.584.07-4.85"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Shop', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(' ', '')}`}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-2">
              {['Pants', 'T-shirts', 'Shorts', 'Kurtis', 'Jacket','Ethnic Wear','sets','Indo Western','Lehenga choli','Footwear','Accessories','Bags'].map((category) => (
                <li key={category}>
                  <a
                    href={`/shop?category=${category}`}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h4>
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
                  className="w-full px-4 py-2 border border-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all duration-200"
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
        <div className="border-t border-gray-100 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">© 2025 KidoTrendz. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">We accept:</span>
              <img
                src={paymentCard}
                alt="Payment methods"
                className="h-8 object-contain opacity-60"
              />
            </div>
            <div className="flex gap-4">
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
