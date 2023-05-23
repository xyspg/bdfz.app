import React from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const History = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/history', fetcher)
  if (isLoading) return <div>loading...</div>
  if (error) return <div>failed to load</div>
  const word_count = data?.data?.reduce((total: any, item: any) => total + item.total_word_count, 0)
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-center items-center gap-2">
          <div className=" bg-gray-100 rounded-md px-4 py-2 shadow-xl font-mono font-bold text-xl">
            {' '}
            <span className="text-neutral-700">Token 总计 </span>
            {word_count}
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
            <Link key={index} href={`/c/${item.chat_id}`} target="_blank">
              <div
                className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:opacity-70
            "
              >
                <div className="text-xs text-neutral-700 ">{formattedTimestamp}</div>
                <div className="text-lg text-neutral-900 font-medium">{firstUserChat.content}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default History
