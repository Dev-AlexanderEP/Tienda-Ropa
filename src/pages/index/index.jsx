
import Navbar from "../../components/navbaar/NavBar";
import Carousel from "./carousel";
export default function Index() {


  return (
    <>
    <div className="h-screen w-full ">
        <div className="h-[80px] w-full bg-red-700">
      <Navbar />

        </div>
        <div className="h-[calc(100%-80px)] w-full  ">
      <Carousel />

        </div>
        
    </div>
      <div className="h-screen w-full bg-red-100">

      </div>

      
    </>
  );
}