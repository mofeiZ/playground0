/* tslint:disable */
/* eslint-disable */
/**
* @param {string} source
* @returns {WasmParserContext}
*/
export function parse_to_context(source: string): WasmParserContext;
/**
*/
export class WasmParserContext {
  free(): void;
/**
* @returns {string}
*/
  static token_strings(): string;
/**
* @returns {Uint32Array}
*/
  get_tokens(): Uint32Array;
/**
* @returns {Uint32Array}
*/
  get_errors(): Uint32Array;
}
