import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import style from './Footer..module.css';

const Footer = () => {
  return (
    <div className={`${style.footerWrapper}  px-3`}>
      <footer className={`${style.footerlinks}  footerlinks`}>
        <ul className="nav justify-content-center  p-3 mt-2">
          <Nav className={`${style.links} mr-auto ms-2 `}>
            <Link href="/" className={`${style.fbarlink}  `}>
              Home
            </Link>
            <Link href="/evc" className={`${style.fbarlink}  `}>
              EV Calculation
            </Link>
            <Link href="/dmr" className={`${style.fbarlink}  `}>
              Raise DMR
            </Link>
          </Nav>
        </ul>
        <p className="text-center footer-head ">© 2023 Nagarro, Inc</p>
      </footer>
    </div>
  );
};

export default Footer;
