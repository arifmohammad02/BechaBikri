import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from "react-icons/fa6";
import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import FooterBottom from "./FooterBottom";
import Whatsapp from "./Whatsapp";

const Footer = () => {
  // Newsletter subscription handler
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add your subscription logic here
    alert("Thank you for subscribing!");
  };

  const footerLinks = {
    shop: [
      { name: "All Products", path: "/shop" },
      { name: "New Arrivals", path: "/shop" },
      { name: "Best Sellers", path: "/shop" },
      { name: "Discounted Items", path: "/shop" },
      { name: "Categories", path: "/shop" }
    ],
    support: [
      { name: "Help Center", path: "#" },
      { name: "Track Order", path: "#" },
      { name: "Returns & Refunds", path: "#" },
      { name: "Shipping Info", path: "#" },
      { name: "FAQ", path: "#" }
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Privacy Policy", path: "#" }
    ]
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook", color: "hover:border-blue-600 hover:text-blue-600" },
    { icon: <FaInstagram />, href: "#", label: "Instagram", color: "hover:border-pink-600 hover:text-pink-600" },
    { icon: <FaYoutube />, href: "#", label: "YouTube", color: "hover:border-red-600 hover:text-red-600" },
    { icon: <FaTwitter />, href: "#", label: "Twitter", color: "hover:border-sky-500 hover:text-sky-500" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn", color: "hover:border-blue-700 hover:text-blue-700" }
  ];

  const contactInfo = [
    { icon: <MdOutlineEmail />, text: "eonlinesolution18@gmail.com", href: "mailto:eonlinesolution18@gmail.com" },
    { icon: <IoCallOutline />, text: "+880 1793-766634", href: "tel:+8801793766634" },
    { icon: <MdLocationOn />, text: "Dhaka, Bangladesh", href: "#" }
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Brand Column - Logo & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Logo className="scale-110 mb-6" />
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                Your trusted destination for premium quality products. 
                We deliver excellence with every order, ensuring customer 
                satisfaction through innovation and reliability.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider">
                  Subscribe to Newsletter
                </h4>
                <p className="text-xs text-gray-400 mb-4">Get exclusive deals and updates</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Join
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Shop Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm mb-6 border-l-4 border-blue-600 pl-3">
                Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[2px] bg-amber-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm mb-6 border-l-4 border-amber-500 pl-3">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[2px] bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm mb-6 border-l-4 border-blue-600 pl-3">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-[2px] bg-amber-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Column */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm mb-6 border-l-4 border-amber-500 pl-3">
              Contact
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href}
                    className="flex items-start gap-3 text-gray-500 hover:text-blue-600 transition-colors duration-300 group"
                  >
                    <span className="text-lg mt-0.5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-sm leading-tight">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="mt-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ y: -3, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 text-lg transition-all duration-300 ${social.color}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges / Payment Methods */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Quality Guarantee</span>
              </div>
            </div>
            
            {/* Payment Methods Icons */}
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">AMEX</div>
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">bKash</div>
            </div>
          </div>
        </motion.div>
      </div>

      <Whatsapp />
      <FooterBottom />
    </footer>
  );
};

export default Footer;