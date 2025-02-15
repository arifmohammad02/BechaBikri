const FooterBottom = () => {
    // Get the current year dynamically
    const currentYear = new Date().getFullYear();
  
    return (
      <div className="bg-gray-800 py-4"> {/* Add white background and padding */}
        <p className="text-base leading-6 font-medium text-center text-[#FFFFFF] font-roboto">
          &copy; {currentYear} Your Company. All rights reserved.
        </p>
      </div>
    );
  };
  
  export default FooterBottom;