import Footer from './footer/Footer';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.container}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
