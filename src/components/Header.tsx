interface HeaderProps {
  currentScore: null | number;
}

export function Header({ currentScore }: HeaderProps) {
  return (
    <header
      className={`${
        currentScore && "!top-10 !text-4xl lg:!top-24 lg:!text-5xl"
      } relative top-28 animate-fade-up text-5xl transition-all 
        duration-1000 ease-in-out sm:top-36 sm:text-6xl`}
    >
      <h1 className="flex flex-col gap-2 bg-gradient-to-r from-orange-500 to-pink-400 bg-clip-text font-bold text-transparent sm:block">
        <span>Genshin Impact</span> Memory Card
      </h1>
    </header>
  );
}
