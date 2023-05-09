import Head from 'next/head'
import { SearchDialog } from '@/components/SearchDialog'
import Header from '@/components/Header'
import Footer from '@/components/ui/Footer'


export default function Home() {
  return (
    <>
      <Head>
        <title>BDFZ AI</title>
        <meta name="description" content="北大附中 AI 助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
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
