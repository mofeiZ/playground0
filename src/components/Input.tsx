import React, { Dispatch, SetStateAction, useMemo } from 'react';
import styles from '../pages/page.module.css';
import lodash from 'lodash';

export function Input(props: {
  setInputText: Dispatch<SetStateAction<string>>;
}) {
  // n00b React Q: how can we get React to optimize these first render / lazy blocks here?
  // We know statically that setInputText is stable + there is no conditional returns / control flow.
  // Why do we need memo slots (i.e. can't useMemo transpile to reading a `isFirstRender` arg here)?
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
