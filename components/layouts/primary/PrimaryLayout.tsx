import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import Footer from '../../footer/Footer';
import Header from '../../header/Header';

import 'react-toastify/dist/ReactToastify.css';

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start';
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  children,
  justify = 'items-center',
  ...divProps
}) => {
  return (
    <>
      <Head>
        <title>PO Module</title>
      </Head>
      <div {...divProps} className={`layout flex flex-col ${justify}`}>
        <Header />
        <main className="">{children}</main>
        {/* <div className="m-auto" /> */}
        <Footer />
        <ToastContainer />
      </div>
    </>
  );
};

export default PrimaryLayout;
