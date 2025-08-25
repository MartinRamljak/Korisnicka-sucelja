interface TitleProps {
  prompt: string;
}

export default function Title({ prompt }: TitleProps) {
  return (
    <div className="flex flex-row justify-between items-end mt-10 w-9/12 mb-4">
      <h1
        className="pl-2 pr-4 border-l-4 border-primary text-base sm:text-2xl md:text-2xl lg:text-
        3xl xl:text-4xl"
      >
        {prompt}
      </h1>


      <a className="text-xs sm:text-xs md:text-base font-bold hover:underline cursor-pointer hover:text-primary whitespace-nowrap">
        See more <span>→</span>
      </a>
    </div>
  );
}
