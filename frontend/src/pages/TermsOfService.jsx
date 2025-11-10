// pages/TermsOfService.jsx
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-4 sm:mb-6 text-center">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 text-center">
            Last updated: October 22, 2025
          </p>

          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base">
                By accessing or using KidoTrendz, you agree to these Terms of Service. If you do not agree, do not use the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">2. Eligibility</h2>
              <p className="text-sm sm:text-base">You must be 18+ or have parental consent. Accounts are for individuals only.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">3. Account and Security</h2>
              <p className="text-sm sm:text-base">
                You are responsible for your account's security. Do not share credentials. We may suspend accounts for violations.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">4. Use of Services</h2>
              <p className="text-sm sm:text-base">You may use the site to browse, purchase, and manage orders. Prohibited: Illegal activities, spam, unauthorized scraping, or infringing IP.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">5. Intellectual Property</h2>
              <p className="text-sm sm:text-base">
                All content (text, images, logos) is owned by us or licensors. You may not copy or distribute without permission. Fair use for personal reference allowed.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">6. Orders and Payments</h2>
              <p className="text-sm sm:text-base">
                All sales final, but we offer refunds for defective items within 30 days. Prices exclude taxes/shipping. Payments via secure processors; you cover any fees.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">7. Shipping and Delivery</h2>
              <p className="text-sm sm:text-base">
                Estimated delivery times provided; delays not our liability. Risk transfers on shipment.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">8. Limitation of Liability</h2>
              <p className="text-sm sm:text-base">
                Site used "as is." We disclaim warranties. Liability limited to purchase price. Not liable for indirect damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">9. Changes to Terms</h2>
              <p className="text-sm sm:text-base">We may update Terms. Continued use constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-500 mb-2 sm:mb-4">10. Contact Us</h2>
              <p className="text-sm sm:text-base">
                Questions? Email <a href="mailto:support@kidotrendz.com" className="text-emerald-600 hover:underline">support@kidotrendz.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;