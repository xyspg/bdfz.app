import Head from 'next/head'
import { SearchDialog } from '@/components/SearchDialog'
import Header from '@/components/Header'
import Footer from '@/components/ui/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>BDFZ AI</title>
        <meta name="description" content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等" />
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
        <meta property="twitter:image" content="/meta.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="/meta.png" />
        <meta property="og:title" content="BDFZ AI" />
        <meta property="og:description" content="北大附中 AI 助手，支持学生手册、事物手册等查询，国际部课程建议等" />
        <meta property="og:url" content="https://bdfz.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen justify-center items-center ">
        <div className="flex-grow p-8 md:p-18 lg:p-24 xl:p-28 2xl:p-32">
          <Header />
          <SearchDialog />
        </div>
        <Footer />
      </div>
    </>
  )
}
