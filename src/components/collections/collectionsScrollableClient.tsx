'use client'
import { MovieCollection } from "@/src/types/types";
import DesktopScroll from "./desktopScroll"
import MobileScroll from "./mobileScroll"


export default function ScrollableCollections ({ collections }: { collections: MovieCollection[] }) {

    return (
        <>
            <div className="hidden lg:flex justify-center ">
                <DesktopScroll collections={collections} />
            </div>
            <div className="lg:hidden">
                <MobileScroll collections={collections} />
            </div>
        </>
    );
    
}