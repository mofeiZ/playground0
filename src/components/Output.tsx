'use client';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useMemo, useState } from 'react';
import type { WasmParserContext } from 'wasm-api';
import Tokens from './OutputTokens';

interface EditorProps {
  source: string;
}

type CompilerResult =
  | {
      kind: 'Context';
      value: WasmParserContext;
    }
  | {
      kind: 'UnexpectedError';
      value: string;
    };

// wasm module must be loaded async, since it requires a web worker (?)
const Output = dynamic(() => {
  return import('wasm-api').then((wasmApi) => {
    const { parse_to_context } = wasmApi;
    const token_strings = wasmApi.WasmParserContext.token_strings().split(',');

    // Factory pattern *might* be cheaper, since React has to track fewer dependencies (?)
    // i.e. constant binding is explicit and language level
    function useCompiler(source: string): CompilerResult {
      const result: CompilerResult = useMemo(() => {
        try {
          return {
            kind: 'Context',
            value: parse_to_context(source),
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

      let context =
        compilerResult.kind === 'Context' ? compilerResult.value : null;
      let error =
        compilerResult.kind === 'UnexpectedError' ? compilerResult.value : null;

      return (
        <div>
          {error && <p>{'Error ' + error}</p>}
          {context && (
            <Tokens
              wasmContext={context}
              source={source}
              tokenLookup={token_strings}
            />
          )}
        </div>
      );
    };
  });
});

export default Output;
