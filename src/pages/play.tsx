import { Editor } from '@/components/Editor';
import React from 'react';
import Head from 'next/head';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        ></meta>
      </Head>
      <div className={styles.header}>
        <p>Playground</p>
      </div>
      <div className={styles.body}>
        <Editor></Editor>
      </div>
    </main>
  );
}
