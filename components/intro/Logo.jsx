import Image from 'next/image'
import icon from '@/public/icon.png'
export function Logomark(props) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image alt="icon" src={icon} width={40} height={40} />
    </div>
  )
}

export function Logo(props) {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Image alt="logo" src={icon} width={40} height={40} />
        <span className="font-mono text-lg font-bold text-black dark:text-neutral-100 ">
          bdfz.app
        </span>
      </div>
    </>
  )
}
