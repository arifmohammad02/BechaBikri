
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#181C14]">
      <div className="container py-12 mx-auto space-y-8 overflow-hidden">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[#fafafa] hover:text-gray-300 "
            >
              Home
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[#fafafa] hover:text-gray-300"
            >
              Shop
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[#fafafa] hover:text-gray-300 "
            >
              About Us
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[#fafafa] hover:text-gray-300"
            >
              Contact Us
            </a>
          </div>
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          <a
            // eslint-disable-next-line react/no-unknown-property
            _blank="true"
            href="https://www.facebook.com/eonlinesolution1?mibextid=ZbWKwL"
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Facebook</span>
            <FaFacebook className="text-3xl hover:text-[#316FF6]" />
          </a>

          <a href="#" className="text-gray-400">
            <span className="sr-only">Whatsapp</span>
            <FaWhatsapp className="text-3xl hover:text-[#075E54]" />
          </a>
        </div>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © 2024 E-online-solution. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
