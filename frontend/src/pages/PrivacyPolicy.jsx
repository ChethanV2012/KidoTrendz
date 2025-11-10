// pages/PrivacyPolicy.jsx
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-500 mb-6 sm:mb-8 font-medium text-sm sm:text-base"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-4 sm:mb-6 text-center">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 text-center">
            Last updated: October 22, 2025
          </p>

          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">1. Introduction</h2>
              <p className="text-sm sm:text-base">
                Welcome to KidoTrendz, We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">2. Information We Collect</h2>
              <p className="mb-2 text-sm sm:text-base">We collect the following types of information:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4 text-sm sm:text-base">
                <li><strong>Personal Information:</strong> Name, email address, password, and payment details (processed securely via third-party gateways like Stripe) during signup, login, or purchases.</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on site (via cookies and analytics tools like Google Analytics).</li>
                <li><strong>Order Information:</strong> Shipping address, product preferences, and order history for fulfillment and personalization.</li>
              </ul>
              <p className="text-sm sm:text-base">We do not collect sensitive information (e.g., health data) unless explicitly provided for a specific purpose.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">3. How We Use Your Information</h2>
              <p className="mb-2 text-sm sm:text-base">We use your information to:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4 text-sm sm:text-base">
                <li>Process orders and manage your account.</li>
                <li>Send promotional emails (you can opt-out anytime).</li>
                <li>Improve our site through analytics.</li>
                <li>Prevent fraud and comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">4. Sharing Your Information</h2>
              <p className="mb-2 text-sm sm:text-base">We do not sell your data. We may share it with:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4 text-sm sm:text-base">
                <li>Service providers (e.g., shipping carriers, payment processors).</li>
                <li>Legal authorities if required by law.</li>
                <li>Affiliates for operational purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">5. Cookies and Tracking</h2>
              <p className="text-sm sm:text-base">
                We use cookies for functionality (e.g., cart persistence) and analytics. You can manage cookies via browser settings. Third-party cookies from Google Analytics help us understand site usage.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">6. Your Rights</h2>
              <p className="mb-2 text-sm sm:text-base">You have the right to:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 mb-3 sm:mb-4 text-sm sm:text-base">
                <li>Access, update, or delete your data via your profile.</li>
                <li>Opt-out of marketing emails.</li>
                <li>File complaints with data protection authorities (e.g., GDPR in EU).</li>
              </ul>
              <p className="text-sm sm:text-base">Contact us at [support@kidotrendz.com] to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">7. Data Security</h2>
              <p className="text-sm sm:text-base">We use HTTPS, encryption, and secure servers to protect your data. However, no system is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">8. Children's Privacy</h2>
              <p className="text-sm sm:text-base">Our site is not for children under 13. We do not knowingly collect their data.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">9. Changes to This Policy</h2>
              <p className="text-sm sm:text-base">We may update this policy. Changes will be posted here with the updated date.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">10. Contact Us</h2>
              <p className="text-sm sm:text-base">
                Questions? Email us at <a href="mailto:support@kidotrendz.com" className="text-emerald-600 hover:underline">support@kidotrendz.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;