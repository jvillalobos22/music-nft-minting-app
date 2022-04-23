import Head from 'next/head';
import CreateTrackListing from '../components/CreateTrackListing/CreateTrackListing';
import Footer from '../components/Footer/Footer';
import styles from '../styles/Layout.module.css';

const CreateTrack = () => (
  <div className={styles.container}>
    <Head>
      <title>TRAX - Create NFT</title>
      <meta
        name="description"
        content="a web3 app to mint and listen to music NFTs"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <CreateTrackListing />
    </main>

    <Footer />
  </div>
);

export default CreateTrack;
