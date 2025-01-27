import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Assets/logo.svg";
import Button from "../Button/button";
const Navbar = () => {
  return (
    <nav className="bg-transparent py-2 pt-[28px] md:pt-4">
      <div className="max-w-[327px] md:max-w-7xl mx-auto flex justify-between items-center md:px-4">
        <Link to="/">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Icon"
              className="h-4 w-[103px] md:h-[32px] md:w-[167.63px] mr-2"
            />
          </div>
        </Link>
        <div className="flex bg-white items-center px-[12px] py-[6px] md:px-[32px] md:py-[14px] button-base transition-all delay-[100ms] rounded-[4.11px] md:rounded-[8px]">
          <Button onClick={() => console.log("Button clicked!")}>
            <p className=" font-Inter text-[10px] md:text-[16px] text-[#0C0B25] font-bold">
              Donate Us
            </p>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// const Navbar = ({ showFullPage }) => {
//   const [navbarStyle, setNavbarStyle] = useState("top");

//   const throttle = (func, limit) => {
//     let inThrottle;
//     return function () {
//       const args = arguments;
//       const context = this;
//       if (!inThrottle) {
//         func.apply(context, args);
//         inThrottle = true;
//         setTimeout(() => (inThrottle = false), limit);
//       }
//     };
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > 200) {
//         setNavbarStyle("hidden");
//       } else if (currentScrollY > 60) {
//         setNavbarStyle("enhanced");
//       } else if (currentScrollY < 40) {
//         setNavbarStyle("top");
//       }
//     };

//     const throttledHandleScroll = throttle(handleScroll, 100); // Throttle scroll event handler

//     window.addEventListener("scroll", throttledHandleScroll);

//     return () => {
//       window.removeEventListener("scroll", throttledHandleScroll);
//     };
//   }, []);
//   return (
//     <nav
//       className={`sticky top-0 left-0 right-0 z-50 transition-all ease-in-out duration-500 ${
//         navbarStyle === "hidden"
//           ? "-translate-y-full opacity-0"
//           : "translate-y-0 opacity-100"
//       } ${
//         !showFullPage
//           ? "bg-[#1f212300] py-2"
//           : navbarStyle === "enhanced"
//           ? "bg-[rgba(0,0,0,0.16)] backdrop-blur-sm shadow-lg py-3"
//           : "bg-transparent py-2"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
//         <div className="flex items-center">
//           <img src={logo} alt="Icon" className="h-[32px] w-[167.63px] mr-2" />
//         </div>
//         <div className="flex bg-white items-center px-[32px] py-[14px] rounded-[8px]">
//           <Button onClick={() => console.log("Button clicked!")}>
//             <p className="font-[manrope] text-[16px] text-[#0C0B25] font-bold">
//               Donate Us
//             </p>
//           </Button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
