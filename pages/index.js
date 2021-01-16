import Head from 'next/head'
import HomeLayout, {siteTitle} from '../components/homeLayout'
import Footer from '../components/footer'
import Wave from '../components/wave'

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }

const waveColorClass = 'text-indigo-600'

export default function Home() {
  return (
    <>
      <HomeLayout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        
      </HomeLayout>
      <Wave />
      <Footer />
    </>
  )
}
