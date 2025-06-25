import { generateRandomCollections } from "@/src/lib/collections";
import Image from "next/image";
import ProcessCollection from "./processCollectionServer"

export async function ScrollableCollections () {
    const collections = await generateRandomCollections(3);

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
                
                <div className="md:hidden w-2/3">
                    <ProcessCollection collection={collections[0]} />
                </div>

                <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:hidden w-full">
                    <ProcessCollection collection={collections[0]} />
                    <ProcessCollection collection={collections[1]} />
                </div>
          
                {/* Desktop - All three collections */}
                <div className="hidden lg:flex lg:justify-between w-full">
                {collections.map((collection) => (
                    <ProcessCollection 
                    key={collection.id} 
                    collection={collection} 
                    />
                ))}
                <Image 
                    src="/images/arrow_right.png" 
                    alt="Right arrow" 
                    width={50} 
                    height={50} 
                    className="self-center w-10 md:w-12 md:py-5 md:px-2
                                border-2 border-gray rounded-2xl p-2 
                                hover:bg-primary cursor-pointer duration-300" 
                    />
                </div>
            </div>
        
        </div>
    );
}