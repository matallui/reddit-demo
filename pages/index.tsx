import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Reddit 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>This is Home!</h1>
    </div>
  )
}

export default Home
