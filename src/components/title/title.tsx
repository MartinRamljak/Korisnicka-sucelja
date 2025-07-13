interface TitleProps {
  prompt: string;
}

export default function Title({ prompt }: TitleProps) {
  return (
    <div className="flex flex-row justify-between mt-10 items-end">
        <h1 className="pl-2 pr-4 border-l-4 border-primary"
            style={{ fontSize: 'clamp(1.5rem, 2vw, 4.375rem)' }}
            >
            {prompt}
        </h1> 
        <a className="text-lg font-bold hover:underline cursor-pointer hover:text-primary">
            See more <span>→</span>
        </a>
    </div>
    )
}