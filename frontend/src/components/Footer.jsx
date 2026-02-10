import { FaFacebook } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "./Logo"; // আপনার লোগো কম্পোনেন্ট
import FooterBottom from "./FooterBottom";
import Whatsapp from "./Whatsapp";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 ">
      <div className="container px-4 py-16 mx-auto">
        <div className="flex flex-col items-center">
          
          {/* 1. লোগোর সাথে মিল রেখে লোগো সেকশন */}
          <div className="mb-12">
            <Logo className="scale-110" /> 
          </div>

          {/* 2. লোগোর ফন্টের সাথে মিল রেখে ন্যাভিগেশন */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "About Us", path: "/about" },
              { name: "Contact Us", path: "/contact" }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="group relative text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-all duration-300 font-mono"
              >
                {link.name}
                {/* লোগোর আন্ডারলাইনের মতো অ্যানিমেশন */}
                <motion.div 
                   className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-blue-600 to-[#B88E2F] w-0 group-hover:w-full transition-all duration-500"
                />
              </Link>
            ))}
          </nav>

          {/* 3. সোশ্যাল আইকন - লোগোর ড্যাশ সার্কেলের থিম */}
          <div className="flex justify-center space-x-6 sm:space-x-10">
            {[
              { icon: <FaFacebook />, href: "#", color: "hover:border-blue-600 hover:text-blue-600" },
              { icon: <MdOutlineEmail />, href: "mailto:eonlinesolution18@gmail.com", color: "hover:border-[#B88E2F] hover:text-[#B88E2F]" },
              { icon: <IoCallOutline />, href: "tel:+8801793766634", color: "hover:border-blue-500 hover:text-blue-500" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ y: -5, rotate: 8 }}
                className={`w-12 h-12 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 text-xl transition-all duration-300 ${social.color}`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <Whatsapp />
      <FooterBottom />
    </footer>
  );
};

export default Footer;