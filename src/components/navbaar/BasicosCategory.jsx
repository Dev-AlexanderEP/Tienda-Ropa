import { Typography, Button } from "@material-tailwind/react";

const BasicosCategory = ({
  img = [],
  basicosMujer = [],
  basicosHombre = [],
  accesorioMujer = [],
  accesorioHombre = [],
  buttonLabel = "Ver Todo",
  buttonHref = "#"
}) => (
  <div className="flex flex-col w-full h-full justify-between font-Poppins px-5 pb-5">
    <div className="flex">
      <div className="w-[15%] h-full">
        <Typography className="font-semibold">Básicos Mujer</Typography>
        {/* Iterar el arreglo basicosMujer */}
        <div className="flex flex-col text-gray-600 gap-y-1 mt-2">
            {basicosMujer.map(item => (
            <Typography as="a" href={item.href} key={item.label}>
                {item.label}
            </Typography>
            ))}

        </div>
       
      </div>
      <div className="w-[15%] h-full">
        <Typography className="font-semibold">Básicos Hombre</Typography>
        {/* Iterar el arreglo basicosHombre */}
        <div className="flex flex-col text-gray-600 gap-y-1 mt-2">
            {basicosHombre.map(item => (
            <Typography as="a" href={item.href} key={item.label}>
                {item.label}
            </Typography>
            ))}

        </div>
      </div>
      <div className="w-[15%] h-full">
        <Typography className="font-semibold">Accesorios Mujer</Typography>
        {/* Iterar el arreglo accesorioMujer */}
        <div className="flex flex-col text-gray-600 gap-y-1 mt-2">
            {accesorioMujer.map(item => (
            <Typography as="a" href={item.href} key={item.label}>
                {item.label}
            </Typography>
            ))}
        </div>
      </div>
      <div className="w-[15%] h-full">
        <Typography className="font-semibold">Accesorios Hombre</Typography>
        {/* Iterar el arreglo accesorioHombre */}
        <div className="flex flex-col text-gray-600 gap-y-1 mt-2">
            {accesorioHombre.map(item => (
              <Typography as="a" href={item.href} key={item.label}>
                {item.label}
              </Typography>
            ))}
        </div>
      </div>
      {/* Imágenes */}  
      <div className="w-[40%] h-full flex items-center justify-center gap-4 ">
        {/* Iterar el arreglo imag para mostrar imágenes */}
        {img.map((img, idx) => (
          <img src={img} alt="" key={idx} className="w-[45%] object-cover" />
        ))}
      </div>
    </div>
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

export default BasicosCategory;