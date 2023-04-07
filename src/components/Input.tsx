import React, { Dispatch, SetStateAction, useMemo } from 'react';
import styles from '../pages/page.module.css';
import lodash from 'lodash';

export function Input(props: {
  setInputText: Dispatch<SetStateAction<string>>;
}) {
  const onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void =
    useMemo(() => {
      const debouncedSet = lodash.debounce(props.setInputText, 400);
      return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        debouncedSet(e.target.value);
      };
    }, [props.setInputText]);

  return (
    <textarea
      rows={100}
      cols={60}
      className={styles.editorinput}
      onChange={onChange}
    ></textarea>
  );
}
