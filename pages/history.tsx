import React from 'react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { TrashIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@/components/ui/skeleton'

const History = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/history', fetcher)
  if (error) return <div>failed to load</div>
  const handleRemove = async (id: string) => {
    const res = await fetch('/api/history', {
      method: 'POST',
      body: JSON.stringify({ removeItem: id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      await mutate('/api/history')
    }
  }

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-center items-center gap-2">
            <div className=" rounded-md font-mono text-xl">
             <Skeleton className='bg-neutral-200 dark:bg-neutral-500 h-8 w-44' />
            </div>
          </div>
          <div
            className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
          >
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          </div>
          <div
            className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
          >
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          </div><div
          className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
        >
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
        </div><div
          className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
        >
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
        </div><div
          className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
        >
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
        </div>

        </div>

      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-center items-center gap-2">
          <div className=" bg-gray-100 dark:bg-neutral-900  rounded-md px-4 py-2 shadow-xl font-mono text-xl flex flex-row gap-4">
            <span className="text-neutral-700 dark:text-neutral-100 font-medium">Token 总计</span>
            <span className="font-bold"> {data.token_count}</span>
          </div>
        </div>

        {data?.data?.map((item: any, index: number) => {
          // Find the first chat history item with role 'user'
          const firstUserChat = item.chat_history.find((chat: any) => chat.role === 'user')

          // If no user chats are found, don't render anything for this item
          if (!firstUserChat) return null
          const date = new Date(item.timestamp)
          const formattedTimestamp =
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            ('0' + date.getHours()).slice(-2) +
            ':' +
            ('0' + date.getMinutes()).slice(-2)

          return (
            <div
              key={index}
              className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200
           "
            >
              <div className="flex flex-row justify-between">
                <Link href={`/c/${item.chat_id}`}>
                  <div>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300">
                      {formattedTimestamp}
                    </div>
                    <div className="text-lg text-neutral-900 font-medium dark:text-neutral-100">
                      {firstUserChat.content}
                    </div>
                  </div>
                </Link>
                <div
                  className="flex justify-center items-center"
                  onClick={() => {
                    handleRemove(item.chat_id)
                  }}
                >
                  <TrashIcon height={20} width={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default History
