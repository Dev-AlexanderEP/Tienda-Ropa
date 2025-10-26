import React from "react";
import { Typography, Button } from "@material-tailwind/react";

const CategoryFlyoutContent = ({ title, moda,basicos,accesorios,  images = [], buttonLabel = "Ver Todo", buttonHref = "#" }) => (
  <div className="flex flex-col w-full h-full justify-between font-Poppins px-5 pb-5  ">  
    <div className="flex">
      <div className="w-[35%] h-full max-lg:w-[70%]">
        <div className="w-full">
          <Typography className="font-semibold">{title}</Typography>
        </div>
        <div className="w-full grid grid-cols-2 text-gray-600 gap-y-1 mt-2">
          {moda.map(item => (
            <Typography as="a" href={item.href} key={item.label} className="col-span-1">
              {item.label}
            </Typography>
          ))}
        </div>
         
      </div>
      <div className=" w-[28%] h-full flex ">
                <div className="w-1/2  px-4 ">
                    <div  className="w-full">
                        <Typography className="font-semibold">Basicos</Typography>
                    </div>
                    <div className="w-full text-gray-600 flex flex-col gap-y-1 mt-2">
                        {basicos.map(item => (
                            <Typography as="a" href={item.href} key={item.label} className="col-span-1">
                            {item.label}
                            </Typography>
                        ))}
                    </div>
                </div>

                <div className="w-1/2  px-4">
                    <div className="w-full">
                        <Typography className="font-semibold">Accesorios</Typography>
                    </div>
                    <div className="w-full text-gray-600 flex flex-col gap-y-1 mt-2">
                        {accesorios.map(item => (
                            <Typography as="a" href={item.href} key={item.label} className="col-span-1">
                            {item.label}
                            </Typography>
                        ))}
                    </div>

                </div>
            </div>
      {images.length > 0 && (
        <div className="w-[40%] h-full flex items-center justify-center gap-4 max-lg:hidden">
          {images.map((img, idx) => (
            <img src={img} alt="" key={idx} className="w-[45%] object-cover" />
          ))}
        </div>
      )}
    </div>
    <div className="w-full h-fit flex justify-center ">
      <Button
        as="a"
        href={buttonHref}
        variant="outline"
        className="rounded-none hover:bg-white hover:border-red-500 hover:text-red-500"
      >
        {buttonLabel}
      </Button>
    </div>
  </div>
);
export default CategoryFlyoutContent;