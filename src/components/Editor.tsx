'use client';
import React, { useState } from 'react';
import { Input } from './Input';
import styles from '../pages/page.module.css';
import Output from './Output';

export function Editor() {
  const [inputText, setInputText] = useState('');

  return (
    <div className={styles.editorarea}>
      <Input setInputText={setInputText}></Input>
      <Output source={inputText} />
    </div>
  );
}
