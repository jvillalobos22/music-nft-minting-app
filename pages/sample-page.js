import Head from 'next/head';

import styles from '../styles/Layout.module.css';
import Footer from '../components/Footer/Footer';
import MyComponent from '../components/sample-connection-page';
import Navigation from '../components/Navigation/Navigation';

const MyTracks = () => (
  <>
    <Head>
      <title>TRAX - My Tracks</title>
      <meta
        name="description"
        content="a web3 app to mint and listen to music NFTs"
      />
    </Head>
    <Navigation />
    <div className={styles.container}>
      <MyComponent />
    </div>
    <Footer />
  </>
);

export default MyTracks;
