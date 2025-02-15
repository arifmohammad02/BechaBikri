import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import Whatsapp from "./Whatsapp";
import FooterBottom from "./FooterBottom";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF]">
      <div className="container py-12 mx-auto space-y-8 overflow-hidden">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <div className="px-5 py-2 group relative">
            <Link
              to="/"
              className="text-base leading-6 text-[#000000] hover:text-[#242424] relative inline-block font-roboto"
            >
              Home
              {/* Border Animation */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#242424] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="px-5 py-2 group relative">
            <Link
              to="/shop"
              className="text-base leading-6 text-[#000000] hover:text-[#242424] relative inline-block font-roboto"
            >
              Shop
              {/* Border Animation */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#242424] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="px-5 py-2 group relative">
            <Link
              to="/about"
              className="text-base leading-6 text-[#000000] hover:text-[#242424] relative inline-block font-roboto"
            >
              About Us
              {/* Border Animation */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#242424] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="px-5 py-2 group relative">
            <Link
              to="/contact"
              className="text-base leading-6 text-[#000000] hover:text-[#242424] relative inline-block font-roboto"
            >
              Contact Us
              {/* Border Animation */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#242424] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          <a
            // eslint-disable-next-line react/no-unknown-property
            _blank="true"
            href="https://www.facebook.com/eonlinesolution1?mibextid=ZbWKwL"
            className="text-[#242424]"
          >
            <span className="sr-only">Facebook</span>
            <FaFacebook className="text-3xl hover:text-[#316FF6]" />
          </a>
          {/* <a href="https://wa.me/+8801793-766634" className="text-[#242424]">
            <span className="sr-only">Whatsapp</span>
            <FaWhatsapp className="text-3xl hover:text-[#075E54]" />
          </a> */}
          <a
            href="mailto:eonlinesolution18@gmail.com"
            className="text-[#242424]"
          >
            <span className="sr-only font-roboto">Email</span>
            <MdOutlineEmail className="text-3xl hover:text-[#B88E2F]" />
          </a>
          <a href="tel:+880 1793-766634" className="text-[#242424]">
            <span className="sr-only font-roboto">Phone</span>
            <IoCallOutline className="text-3xl hover:text-[#B88E2F]" />
          </a>
        </div>
      </div>
      <Whatsapp />
      <FooterBottom />
    </footer>
  );
};

export default Footer;
