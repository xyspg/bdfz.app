import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/intro/Container'
import { TextField } from '@/components/Fields'
import { Logomark } from '@/components/intro/Logo'
import { NavLinks } from '@/components/NavLinks'
import qrCode from '@/images/qrcode.png'
import React from 'react'

function QrCodeBorder(props) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IntroFooter() {
  const FooterItem = [
    { title: '使用条款', href: '/policies/terms-of-use' },
    { title: '隐私政策', href: '/policies/privacy' },
  ]
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <Logomark className="h-10 w-10 flex-none fill-cyan-500" />
              <div className="ml-4">
                <p className="text-base font-semibold font-mono">bdfz.app</p>
                <p className="mt-1 text-sm">文档信息，一键搜</p>
              </div>
            </div>
            <nav className="mt-11 flex gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-cyan-500" />
              <Image src={qrCode} height={85} alt="qrcode" unoptimized />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <Link href="#">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  在手机上打开
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">扫描二维码，在手机上打开 BDFZ AI</p>
            </div>
          </div>
        </div>
        <div className="w-full py-4 flex flex-col items-center border-t border-gray-200 lg:flex-row lg:justify-between lg:pt-6 gap-y-1">
          <p className="text-xs md:text-xs text-gray-500 md:mt-0 ">
            BDFZ AI 基于 OpenAI API 构建，生成内容不代表官方立场
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-x-4">
            <div className="flex flex-row gap-2">
              {FooterItem.map((item, index) => (
                <Link
                  key={index}
                  className="text-xs text-center text-gray-500 dark:text-gray-300"
                  href={item.href}
                  data-umami-event={`click footer ${item.title}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500 md:mt-0">
              &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
