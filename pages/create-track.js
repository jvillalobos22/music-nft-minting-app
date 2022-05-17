import Head from 'next/head';
import CreateTrackListing from '../components/CreateTrackListing/CreateTrackListing';
import Footer from '../components/Footer/Footer';
import Navigation from '../components/Navigation/Navigation';
import styles from '../styles/Layout.module.css';

const CreateTrack = () => (
  <>
    <Head>
      <title>TRAX - Create NFT</title>
      <meta
        name="description"
        content="a web3 app to mint and listen to music NFTs"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navigation />

    <main className={styles.main}>
      <div className={styles.container}>
        <CreateTrackListing />
      </div>
    </main>

    <Footer />
  </>
);

export default CreateTrack;
