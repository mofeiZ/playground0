import React from 'react';
import styles from '../pages/page.module.css';
import type { WasmParserContext } from 'wasm-api';
import invariant from 'invariant';

// TODO: highlighting for unicode is off, since Rust source is currently
// returning byte offsets (not char offsets)

export default function TokenTab({
  wasmContext,
  source,
  tokenLookup,
}: {
  wasmContext: WasmParserContext;
  source: string;
  tokenLookup: Array<string>;
}) {
  const tokens = wasmContext.get_tokens();
  const errors = wasmContext.get_errors();
  invariant(tokens.length % 3 === 0, 'Bad length tokens', tokens);
  invariant(errors.length % 3 === 0, 'Bad length errors', errors);

  const highlights: Array<[number, number, string, string]> = [];
  for (let i = 0; i < tokens.length; i += 3) {
    const description = tokenLookup[tokens[i]];
    invariant(
      description != null,
      'Internal error, wasm string table inconsistent'
    );
    highlights.push([tokens[i + 1], tokens[i + 2], styles.token, description]);
  }
  for (let i = 0; i < errors.length; i += 3) {
    highlights.push([errors[i + 1], errors[i + 2], styles.tokenbad, '<error>']);
  }

  highlights.sort((a, b) => a[0] - b[0]);

  if (highlights.length > 1) {
    invariant(highlights[0][0] < highlights[1][0], 'Bad order!');
  }
  return <HighlightedTextArea source={source} highlights={highlights} />;
}

type HighlightedTextAreaProps = {
  source: string;
  // start, end, css-class, on-hover
  highlights: Array<[number, number, string, string]>;
};

// We *might* want to use a canvas at some point, but let's do what's easy for now!
// (What are the limits of DOM perf anyway, surely it can handle 100000s of text nodes 🧐)
// https://github.com/evanw/source-map-visualization looks p cool
function HighlightedTextArea({ source, highlights }: HighlightedTextAreaProps) {
  const snippets: Array<string | React.ReactElement> = [];

  let lastHighlight = 0;

  for (const [start, end, cssClass, description] of highlights) {
    if (start !== lastHighlight) {
      invariant(start > lastHighlight, 'bad start!');
      snippets.push(source.slice(lastHighlight, start));
    }
    snippets.push(
      <mark className={cssClass + ' ' + styles.tooltip}>
        {source.slice(start, end)}
        <span className={styles.tooltiptext}>{description}</span>
      </mark>
    );
    lastHighlight = end;
  }

  if (lastHighlight !== source.length) {
    snippets.push(source.slice(lastHighlight));
  }

  return <div className={styles.tokenoutput}>{snippets}</div>;
}
