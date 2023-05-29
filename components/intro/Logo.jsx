import Image from 'next/image'
export function Logomark(props) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image src="/icon.png" width={40} height={40} />
    </div>
  )
}

export function Logo(props) {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Image src="/icon.png" width={40} height={40} />
        <span className="font-mono text-lg font-bold text-black dark:text-neutral-100 ">
          bdfz.app
        </span>
      </div>
    </>
  )
}
