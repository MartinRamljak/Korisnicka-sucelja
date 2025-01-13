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
      <div key={index}  className="flex flex-col justify-between w-full max-w-[1200px] mx-auto h-full" style={{ transform: "scale(0.8)" }}>
        {/* Container for the images */}
        <div className="relative h-96">
          {collection.images.map((image, idx) => (
            <div
              key={idx}
              className={`absolute w-[66.67%] h-[100%] aspect-[2/3]
                ${idx === 0 ? 'top-0 left-0' : idx === 1 ? 'top-4 left-10' : 'top-8 left-20'} 
                w-full h-full 
                z-${30 - idx * 10}`}
            >
              <Image src={image.src} 
                    alt={image.alt} layout="fill" objectFit="contain" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
            </div>
          ))}
        </div>
        {/* Title below the images */}
        <h2
          className="mb-4 mt-7 hover:text-primary cursor-pointer"
          style={{ fontSize: "clamp(1.5rem, 2vw, 4.375rem)" }}
        >
          {collection.title}
        </h2>
      </div>
    );
  }
  
  
  export function Collections() {
    return (
      <div className="w-9/12">
        <h1
          className="pl-2 border-l-4 border-primary"
          style={{ fontSize: 'clamp(1.5rem, 2vw, 4.375rem)' }}
        >
          Collections
        </h1>
  
        {/* For small screens, only show the first collection */}
        <div className="lg:hidden">
          {processCollection(collections[0], 0)}
        </div>
  
        {/* For medium and larger screens, show all three collections in a row */}
        <div className="hidden lg:flex lg:justify-between w-full">
          {collections.map((collection, index) => (
              processCollection(collection, index)
          ))}
        </div>
      </div>
    );
  }
  
  