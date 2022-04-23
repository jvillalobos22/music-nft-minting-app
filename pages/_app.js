/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import '../styles/globals.css';
import Link from 'next/link';

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Minted Music</p>
        <div className="flex mt-4">
          <div className="mr-6 text-cyan-500">
            <Link href="/" passHref>
              Listen
            </Link>
          </div>
          <div className="mr-6 text-cyan-500">
            <Link href="/create-track">Create Track NFT</Link>
          </div>
          <div className="mr-6 text-cyan-500">
            <Link href="/my-tracks">My Tracks</Link>
          </div>
          <div className="mr-6 text-cyan-500">
            <Link href="/creator-dashboard">Creator Dashboard</Link>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
