'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/react-hook-form/form'
import { useUser } from '@supabase/auth-helpers-react'
import useSWR from 'swr'
import React, { useContext } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserStatusContext } from '@/lib/userContext'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [{ value: 'https://shadcn.com' }, { value: 'http://twitter.com/shadcn' }],
}

export function Profile() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const user = useUser()
  const { isPaidUser, isAdmin } = useContext(UserStatusContext)

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/history', fetcher)
  return (
    <Form {...form}>
      <form className="space-y-8 dark:text-neutral-200">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email 地址</FormLabel>
              <FormControl>
                <p className="text-md text-neutral-800 dark:text-neutral-200">{user?.email}</p>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tokens</FormLabel>
              <FormControl>
                <p className="text-md font-mono text-neutral-800 dark:text-neutral-200">
                  {isLoading ? (
                    <>
                      <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-6 w-[100px]" />
                    </>
                  ) : (
                    <span>{data?.token_count}</span>
                  )}
                </p>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {data?.gpt4_token_count > 0 && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPT4 Tokens</FormLabel>
                <FormControl>
                  <p className="text-md font-mono text-neutral-800 dark:text-neutral-200">
                    {isLoading ? (
                      <>
                        <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[100px]" />
                      </>
                    ) : (
                      <span>{data?.gpt4_token_count}</span>
                    )}
                  </p>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(isPaidUser || isAdmin) && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>身份</FormLabel>
                <FormControl>
                  <p className="text-md font-mono text-neutral-800 dark:text-neutral-200">
                    {isLoading ? (
                      <>
                        <Skeleton className="bg-neutral-300 dark:bg-neutral-400 h-4 w-[100px]" />
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 ">
                        {isPaidUser && <span>付费用户</span>}
                        {isAdmin && <span>管理员</span>}
                      </div>
                    )}
                  </p>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
