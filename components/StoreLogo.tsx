import Link from 'next/link';

export default function StoreLogo() {
  return (
    <Link href="/" aria-label="Jackson Works home" className="inline-flex shrink-0 items-center gap-2 text-zinc-950 sm:gap-2.5">
      <svg aria-hidden="true" viewBox="0 0 44 44" className="h-8 w-8 shrink-0 sm:h-11 sm:w-11" fill="none">
        <rect width="44" height="44" rx="10" fill="#18181b" />
        <path d="M11 13h9l-3 12a6 6 0 0 1-6 5H7" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path d="m23 16 1 14 6-9 2 9 7-14" stroke="#ffd84d" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col gap-1">
        <span className="text-[14px] font-black uppercase leading-none tracking-tight min-[360px]:text-[17px] sm:text-[20px]">Jackson Works</span>
        <span className="text-[7px] font-bold uppercase leading-none tracking-[0.14em] text-zinc-600 sm:text-[9px] sm:tracking-[0.18em]">Performance Automotive</span>
      </span>
    </Link>
  );
}
