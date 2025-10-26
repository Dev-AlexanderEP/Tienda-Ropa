
import Navbar from "../../components/navbaar/NavBar";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import Carousel from "./carousel";
import WhatsAppButton from "../../components/contact/WhatsAppButton";
import FooterC from "../../components/footer/Footer";
import Frame2 from "./Frame2";
import Frame3 from "./Frame3";
import Frame4 from "./Frame4";
import Frame5 from "./Frame5";
import Frame6 from "./Frame6";
import Frame7 from "./Frame7";
import Frame8 from "./Frame8";
export default function Index() {


  return (
    <>
    
    <div className="h-screen w-full max-2xl:h-auto ">
      <div className="sticky top-0 left-0 z-50 w-full bg-red-700 h-[80px]">
        {/* <Navbar /> */}
        <NavBarResponsive />
      </div>
      <div className="h-[calc(100%-80px)] w-full  mb-3 max-md:mb-1 max-sm:hidden">
        <Carousel />
      </div>
        
    </div>
    {/* <WhatsAppButton /> */}
          <Frame2 />
          <Frame3 />
          <Frame4 />
          <Frame5 />
          <Frame6 />
          <Frame7 />
          <Frame8 />
          <FooterC />
    </>
  );
}