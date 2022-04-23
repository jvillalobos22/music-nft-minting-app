import React from 'react';

import styles from '../../styles/Footer.module.css';

const Footer = () => (
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
);

export default Footer;
