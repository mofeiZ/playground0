'use client';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useMemo, useState } from 'react';
import type { WasmParserContext } from 'wasm-api';
import Tokens from './OutputTokens';
import OutputTabs from './OutputTabs';
import Parser, { ParseNodePropertyMetadata } from './OutputParser';
import invariant from 'invariant';

interface EditorProps {
  source: string;
}

type CompilerResult =
  | {
      kind: 'Context';
      value: WasmParserContext;
      source: string;
    }
  | {
      kind: 'UnexpectedError';
      value: string;
    };

const unicodeChar = /[^\u0000-\u00ff]/g;

type ParseTreeObjectProperty = {
  is_node: boolean;
  is_variadic: boolean;
  name: string;
};

function getValidatedParseTreeMetadata(
  raw: string
): Array<[string, Array<ParseNodePropertyMetadata>]> {
  const decoded: Array<[string, number, Array<ParseTreeObjectProperty>]> =
    JSON.parse(raw);

  // Validate decoded
  invariant(
    Array.isArray(decoded),
    '[Init] Expected JSON array when decoding ParseTree metadata'
  );

  for (const element of decoded) {
    invariant(
      Array.isArray(element) && element.length === 3,
      '[Init] Expected JSON array of tuples (array) when decoding ParseTree metadata'
    );
    const properties = element[2];
    invariant(
      typeof element[0] === 'string' &&
        typeof element[1] === 'number' &&
        Array.isArray(properties),
      '[Init] Bad tuple types when decoding ParseTree metadata'
    );

    for (const property of properties) {
      invariant(
        typeof property === 'object' && property != null,
        '[Init] Bad tuple types when decoding ParseTree metadata'
      );
      invariant(
        typeof property.is_node === 'boolean' &&
          typeof property.is_variadic === 'boolean' &&
          typeof property.name === 'string',
        '[Init] Bad property types when decoding ParseTree metadata'
      );
    }
  }

  const transformed: Array<[string, Array<ParseNodePropertyMetadata>]> =
    decoded.map(([name, id, property], idx) => {
      invariant(id === idx, `Bad property index ${id} !== ${idx}`);
      return [
        name,
        property.map((value) => {
          return {
            isNode: value.is_node,
            isVariadic: value.is_variadic,
            name: value.name,
          };
        }),
      ];
    });
  return transformed;
}

// wasm module must be loaded async, since it requires a web worker (?)
const Output = dynamic(() => {
  return import('wasm-api').then((wasmApi) => {
    const { parse_to_context } = wasmApi;
    const token_strings = wasmApi.WasmParserContext.token_strings().split(',');
    const parseTreeMetadata = getValidatedParseTreeMetadata(
      wasmApi.WasmParserContext.parse_tree_node_shapes()
    );

    // Factory pattern *might* be cheaper, since React has to track fewer dependencies (?)
    // i.e. constant binding is explicit and language level
    function useCompiler(source: string): CompilerResult {
      const result: CompilerResult = useMemo(() => {
        try {
          // Rust/wasm and JS use differnt length unicode encodings for some characters.
          // Since unicode will never be symbols / lexemes, we can always replace them
          // with non-visible ascii.
          const strippedSource = source.replaceAll(unicodeChar, '\u007f');
          const context = parse_to_context(strippedSource);
          return {
            kind: 'Context',
            value: context,
            source: source,
          };
        } catch (e) {
          return {
            kind: 'UnexpectedError',
            value: `<internal error> ${e} ${typeof e}`,
          };
        }
      }, [source]);
      return result;
    }

    return function ResolvedOutput({ source }: EditorProps) {
      let [wasmContext, setWasmContext] = useState<WasmParserContext | null>(
        null
      );

      let compilerResult = useCompiler(source);

      useEffect(() => {
        if (
          compilerResult.kind === 'Context' &&
          wasmContext !== compilerResult.value
        ) {
          if (wasmContext) {
            // todo: we should return this as cleanup function
            wasmContext.free();
          }
          // This should be an effect, right? setState during render will always trigger a second
          // render 🧐 (which should be a no-op)
          // Also, the entire purpose of this state is for its side effects, since useCompiler
          // already takes care of memoizing source -> result computation.
          // TODO remove wasmContext state
          setWasmContext(compilerResult.value);
        }
        // No-op if compilerResult.kind === 'Context' && wasmContext === compilerResult.value
        // (next render after set)
      }, [compilerResult, wasmContext]);

      let result = compilerResult.kind === 'Context' ? compilerResult : null;
      let error =
        compilerResult.kind === 'UnexpectedError' ? compilerResult.value : null;

      // data: Uint32Array;
      // internedStrings: string[];
      // nodeShapes: [string, ParseNodePropertyShape[]][];

      const tabsList: Map<string, React.ReactNode> = new Map();
      if (result) {
        const { value, source } = result;

        tabsList.set(
          'tokens',
          <Tokens
            wasmContext={value}
            source={source}
            tokenLookup={token_strings}
          />
        );

        if (value.has_parse_tree()) {
          const parseTree = value.get_parse_tree();
          const parseTreeData = parseTree.get_encoded_tree();
          const parseTreeStrings = parseTree.get_strings();
          console.log(' >>> Parse tree data len!', parseTreeData.length);
          console.log(' >>> Parse tree strings!', parseTreeStrings);

          tabsList.set(
            'parser',
            <Parser
              data={parseTreeData}
              internedStrings={JSON.parse(parseTreeStrings)}
              nodeMetadata={parseTreeMetadata}
            />
          );
        } else {
          tabsList.set('parser', <div>Failed to parse. (TODO error)</div>);
        }
      }

      let outputTabs = tabsList.size > 0 && (
        <OutputTabs defaultTab={null} tabs={tabsList} />
      );
      return (
        <div>
          {error && <p>{'Error ' + error}</p>}
          {outputTabs}
        </div>
      );
    };
  });
});

export default Output;
