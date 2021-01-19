import Head from 'next/head'
import HomeLayout, {siteTitle} from '../components/homeLayout'

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

export default function Home() {
  return (
    <>
      <HomeLayout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
      </HomeLayout>
    </>
  )
}
