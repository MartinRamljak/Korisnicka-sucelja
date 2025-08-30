import Link from "next/link";

interface TitleProps {
  prompt: string;
  href?: string;
}

export default function Title({ prompt, href = "/" }: TitleProps) {
  return (
    <div className="flex flex-row justify-between items-center md:items-end mt-10 w-9/12 mb-4">
      <h1
        className="pl-2 pr-4 border-l-4 border-primary text-base sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl"
      >
        {prompt}
      </h1>

      <Link
        href={href}
        className="text-xs sm:text-xs md:text-base font-bold hover:underline cursor-pointer hover:text-primary whitespace-nowrap"
      >
        See more <span>→</span>
      </Link>
    </div>
  );
}
