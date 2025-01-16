import Image from "next/image";

type Collection = {
  title: string;
  images: {
    src: string;
    alt: string;
  }[];
};

const collections: Collection[] = [
  {
    title: "Horror movies",
    images: [
      { src: "/images/the_conjuring.jpg", alt: "The Conjuring" },
      { src: "/images/the_texas_chainsaw_massacre.jpg", alt: "Texas Chainsaw Massacre" },
      { src: "/images/sinister.jpg", alt: "Sinister" },
    ],
  },
  {
    title: "Old classics",
    images: [
      { src: "/images/gone_with_the_wind.jpg", alt: "Gone With The Wind" },
      { src: "/images/casablanca.jpg", alt: "Casablanca" },
      { src: "/images/12_angry_men.jpg", alt: "12 Angry Men" },
    ],
  },
  {
    title: "Not in English",
    images: [
      { src: "/images/the_skin_i_live_in.jpg", alt: "Skin I Live In" },
      { src: "/images/amelie.jpg", alt: "Amelie" },
      { src: "/images/parasite.jpg", alt: "Parasite" },
    ],
  },
];

  function processCollection(collection: Collection, index: number) {
    return (
      <div key={index}  
      className="flex flex-col justify-center gap-4 
                  w-full max-w-[1200px] mx-auto" 
                  style={{ transform: "scale(0.8)" }}>

        {/* Container for the images */}
        <div className="grid relative w-full h-[60vh]" 
              style={{  gridTemplateColumns: "repeat(15, minmax(0, 1fr))" ,
                        gridTemplateRows: "repeat(15, minmax(0, 1fr))"  
              }}>
                
          {collection.images.map((image, idx) => (
              <Image src={image.src} 
                    alt={image.alt} layout="fill" 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    key={idx}
                    className={`aspect-[2/3]
                      object-contain
                      w-full h-full 
                      z-${30 - idx * 10}`}
                      style={{ gridColumn: idx === 0 ? '1/span 13' : idx === 1 ? '2/span 13' : '3/span 13',
                      gridRow: idx === 0 ? '1/span 13' : idx === 1 ? '2/span 13' : '3/span 13' }}/>
          ))}
        </div>
        {/* Title below the images */}
        <h2
          className="mb-4 hover:text-primary cursor-pointer duration-300"
          style={{ fontSize: "clamp(1.5rem, 2vw, 4.375rem)" }}
        >
          {collection.title}
        </h2>
      </div>
    );
  }
  
  export function Collections() {
    return (
      <div className="flex-col justify-around w-9/12 h-fit">
        <h1
          className="pl-2 mt-20 border-l-4 border-primary"
          style={{ fontSize: 'clamp(1.5rem, 2vw, 4.375rem)' }}
        >
          Collections
        </h1>
        
        <div className="flex justify-between">
          <Image src="/images/arrow_left.png" alt="Left arrow" width={50} height={50}
          className="self-center  w-10 md:w-12 md:py-5 md:px-2
                    border-2 border-gray rounded-2xl p-2 
                    hover:bg-primary cursor-pointer duration-300" />
          {/* For small screens, only show the first collection */}
          <div className="md:hidden w-2/3">
            {processCollection(collections[0], 0)}
          </div>
    
          {/* For medium screens, show two collections in a row */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:hidden w-full">
            {collections.slice(0, 2).map((collection, index) => (
              processCollection(collection, index)
            ))}
          </div>
          
          {/* For larger screens, show all three collections in a row */}
          <div className="hidden lg:flex lg:justify-between w-full">
            {collections.map((collection, index) => (
                processCollection(collection, index)
            ))}
          </div>
          <Image src="/images/arrow_right.png" alt="Left arrow" width={50} height={50} 
          className="self-center w-10 md:w-12 md:py-5 md:px-2
                    border-2 border-gray rounded-2xl p-2 
                    hover:bg-primary cursor-pointer duration-300" />
        </div>
      </div>
    );
  }
  
  