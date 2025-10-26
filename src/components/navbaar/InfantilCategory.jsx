import { Typography, Button } from "@material-tailwind/react";

const InfantilCategory = ({
  img = [],
  ninias ,
  ninios ,
  accesorios,
  buttonLabel = "Ver Todo",
  buttonHref = "#"
}) => (
  <div className="flex flex-col w-full h-full justify-between font-Poppins px-5 pb-5 ">
    <div className="flex">

      {/* ninias */}
      <div className="w-[40%] h-full max-lg:w-[50%]">
        <Typography className="font-semibold ">Ninias</Typography>
        {/* Iterar el arreglo ninias */}
        <div className="w-full text-gray-600 grid grid-cols-2 gap-y-1 mt-2">
          {ninias.map(item => (
            <Typography as="a" href={item.href} key={item.label} className="col-span-1">
              {item.label}
            </Typography>
          ))}
        </div>
      </div>

      {/* ninios */}
      <div className="w-[40%] h-full  max-lg:w-[50%]">

        <div className="w-[100%]  ">
          <Typography className="font-semibold">Niños</Typography>
          {/* Iterar el arreglo ninios */}
          <div className="w-full text-gray-600 grid grid-cols-2 gap-y-1 mt-2">
            {ninios.map(item => (
              <Typography as="a" href={item.href} key={item.label}>
                {item.label}
              </Typography>
            ))}
          </div>
        
        </div>
        <div className="w-[100%] mt-3">
          <Typography className="font-semibold">Accesorios</Typography>
          {/* Iterar el arreglo accesorios */}
          <div className="w-full text-gray-600 grid grid-cols-2 gap-y-1 mt-2">
            {accesorios.map(item => (
              <Typography as="a" href={item.href} key={item.label}>
                {item.label}
              </Typography>
            ))}
          </div>
        </div>
      </div>

      {/* Imágenes */}  
      <div className="w-[40%] h-full flex items-center justify-center gap-4 max-lg:hidden">
        {/* Iterar el arreglo imag para mostrar imágenes */}
        {img.map((img, idx) => (
          <img src={img} alt="" key={idx} className="w-[45%] object-cover" />
        ))}
      </div>
    </div>


    {/* Botón "Ver Todo" */}
    <div className="w-full flex justify-center mt-4">
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

export default InfantilCategory;