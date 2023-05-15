import React, { useState } from 'react';
import styles from '../pages/page.module.css';

export default function OutputTabs(props: {
  defaultTab: string | null;
  tabs: Map<string, React.ReactNode>;
}): React.ReactElement {
  let [selected, setSelected] = useState<string | null>(props.defaultTab);
  if (selected === null) {
    selected = Object.keys(props.tabs)[0];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 8 }}>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          flex: 'none',
          marginBottom: 10,
        }}
      >
        {[...props.tabs.keys()].map((name, index, all) => {
          const isFirst = index === 0;
          const isSelected = name === selected;
          return (
            <React.Fragment key={name}>
              {isFirst ? null : <div className={styles.outputTabSeparator} />}
              <div
                className={
                  styles.outputTab +
                  (isSelected ? ' ' + styles.outputTabSelected : '')
                }
              >
                <button
                  disabled={isSelected}
                  onClick={() => setSelected(name)}
                  className={styles.tabButton}
                >
                  {name}
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {props.tabs.get(selected)}
    </div>
  );
}
