import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Minted Music</title>
      <meta
        name="description"
        content="a web3 app to mint and listen to music NFTs"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>This is where the NFTs will show</h1>
    </main>

    <footer className={styles.footer}>
      <a
        href="https://juantonmusic.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Built by&nbsp;
        <span>Juanton</span>
      </a>
    </footer>
  </div>
);

export default Home;
