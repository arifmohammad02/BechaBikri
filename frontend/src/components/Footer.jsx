import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF]">
      <div className="container py-12 mx-auto space-y-8 overflow-hidden">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[##000000] hover:text-[#242424] "
            >
              Home
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[##000000] hover:text-[#242424]"
            >
              Shop
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[##000000] hover:text-[#242424] "
            >
              About Us
            </a>
          </div>
          <div className="px-5 py-2">
            <a
              href="#"
              className="text-base leading-6 text-[##000000] hover:text-[#242424]"
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
            className="text-[#242424]"
          >
            <span className="sr-only">Facebook</span>
            <FaFacebook className="text-3xl hover:text-[#316FF6]" />
          </a>

          <a href="https://wa.me/+8801793-766634" className="text-[#242424]">
            <span className="sr-only">Whatsapp</span>
            <FaWhatsapp className="text-3xl hover:text-[#075E54]" />
          </a>
          <a
            href="mailto:eonlinesolution18@gmail.com"
            className="text-[#242424]"
          >
            <span className="sr-only">Email</span>
            <MdOutlineEmail className="text-3xl hover:text-[#B88E2F]" />
          </a>
        </div>
        <p className="mt-8 text-base leading-6 text-center text-[#242424]">
          © 2024 E-online-solution. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
