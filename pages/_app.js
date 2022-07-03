import Head from 'next/head';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.67, user-scalable=0"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
