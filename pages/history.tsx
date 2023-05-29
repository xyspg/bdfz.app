import React from 'react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { TrashIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Layout from '@/components/Layout'

import { useRouter } from 'next/router'
import remarkGfm from 'remark-gfm'
import style from '@/styles/markdown-styles.module.css'
import ReactMarkdown from 'react-markdown'

const History = () => {
  const router = useRouter()
  const [deleting, setDeleting] = React.useState(false)
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/history', fetcher)
  if (error) return <div>failed to load</div>
  const handleRemove = async (id: string) => {
    setDeleting(true)
    const res = await fetch('/api/history', {
      method: 'POST',
      body: JSON.stringify({ removeItem: id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      await mutate('/api/history')
      setDeleting(false)
    }
  }

  const handleClear = async () => {
    const res = await fetch('/api/history', {
      method: 'POST',
      body: JSON.stringify({ clear: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      await mutate('/api/history')
    }
    window.location.href = '/history'
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/history?export=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'export.csv'
      document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click()
      a.remove() //afterwards we remove the a-tag again
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-center items-center gap-2">
            <div className=" rounded-md font-mono text-xl">
              <Skeleton className="bg-neutral-200 dark:bg-neutral-500 h-8 w-44" />
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
          </div>
          <div
            className="flex flex-col px-6 py-4 bg-neutral-50 shadow-md rounded-xl w-full cursor-pointer
            hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200 gap-y-2"
          >
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
            <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[300px]" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col gap-4 w-full md:w-2/3 ">
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
                className="px-6 py-4 bg-neutral-50 shadow-sm rounded-md w-full
            hover:bg-neutral-100 dark:bg-neutral-500 dark:hover:bg-neutral-600 transition duration-200
            flex flex-row justify-between relative
           "
              >
                <div className="flex flex-row justify-between relative cursor-pointer w-full px-4">
                  <Link href={`/c/${item.chat_id}`} className="absolute inset-0" target="_blank" />
                  <div className="flex flex-col">
                    <div className="text-xs text-neutral-700 dark:text-neutral-300 flex flex-row flex-wrap items-center gap-1">
                      {formattedTimestamp}
                      <span>&middot;</span>
                      {item.total_word_count > 0 && (
                        <span className=" text-xs font-medium dark:text-neutral-200">
                          {item.total_word_count} Tokens
                        </span>
                      )}
                      {item.model === 'gpt-4' && (
                        <span className="flex flex-row items-center gap-1">
                          <span className="text-xs font-medium dark:text-neutral-200">
                            {((item.total_word_count / 1000) * 0.231).toFixed(2)} CNY
                          </span>
                          <span
                            className="inline-flex items-center px-2.5  rounded-full text-[9px] font-medium bg-opacity-70 bg-indigo-900 text-neutral-100 border dark:border-neutral-700
                        "
                          >
                            GPT-4
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="text-lg text-neutral-900 max-w-[70vw] dark:text-neutral-100 flex flex-row items-start overflow-hidden break-words mr-8">
                      <ReactMarkdown
                        linkTarget="_blank"
                        className={style.reactMarkDown}
                        remarkPlugins={[remarkGfm]}
                      >
                        {firstUserChat.content.substring(0, 300)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <Button
                  className="absolute right-4"
                  onClick={() => {
                    handleRemove(item.chat_id)
                  }}
                  disabled={deleting}
                  variant="destructive"
                >
                  <TrashIcon height={20} width={20} />
                </Button>
              </div>
            )
          })}
          <div>
            <div className="flex flex-row gap-2 float-right mb-12">
              <Button variant="outline" onClick={handleExport}>
                导出数据
              </Button>
              <Dialog>
                <DialogTrigger asChild className="float-right">
                  <Button className="" variant="destructive">
                    清空历史记录
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px bg-white">
                  <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>确定要清空历史记录吗？</DialogTitle>
                    <DialogDescription>历史记录将被永久清空，该操作无法被撤销</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" className="w-20" onClick={handleClear}>
                      确定
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default History
