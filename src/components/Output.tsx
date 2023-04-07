'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useMemo, useState } from 'react';
import type {
  WasmParserContext,
  WasmParserError,
  WasmParserResult,
} from 'wasm-api';

interface EditorProps {
  source: string;
}

type CompilerResult =
  | {
      kind: 'Context';
      value: WasmParserContext;
    }
  | {
      kind: 'Error';
      value: WasmParserError;
    }
  | {
      kind: 'UnexpectedError';
      value: string;
    };

function useCompiler(
  build_context: (source: string) => WasmParserResult,
  source: string
): CompilerResult {
  const result: CompilerResult = useMemo(() => {
    try {
      const result = build_context(source);
      if (result.is_context()) {
        return {
          kind: 'Context',
          value: result.get_context(),
        };
      } else {
        return {
          kind: 'Error',
          value: result.get_error(),
        };
      }
    } catch (e) {
      return {
        kind: 'UnexpectedError',
        value: '<internal error>',
      };
    }
  }, [build_context, source]);
  return result;
}

// wasm module must be loaded async, since it requires a web worker (?)
const Output = dynamic(() => {
  return import('wasm-api').then((wasmApi) => {
    const { parse_to_context } = wasmApi;

    return function ResolvedOutput({ source }: EditorProps) {
      let [wasmContext, setWasmContext] = useState<WasmParserContext | null>(
        null
      );

      let compilerResult = useCompiler(parse_to_context, source);

      useMemo(() => {
        if (compilerResult.kind === 'Context') {
          if (wasmContext !== compilerResult.value) {
            if (wasmContext) {
              wasmContext.free();
            }
            setWasmContext(compilerResult.value);
          }
          // otherwise, wasmContext may have changed (next render after set)
        }
      }, [compilerResult, wasmContext]);

      let outputText = useMemo(() => {
        let text = ' output \n\n-----\n';
        if (compilerResult.kind === 'Context') {
          text += compilerResult.value.print_ast();
        } else if (compilerResult.kind === 'Error') {
          text += `<error @ ${compilerResult.value.cursor}>\n${compilerResult.value.message}`;
        } else {
          text += '<internal error>';
        }
        return text;
      }, [compilerResult]);
      return (
        <div>
          <textarea rows={100} cols={70} readOnly={true} value={outputText} />
        </div>
      );
    };
  });
});

export default Output;
