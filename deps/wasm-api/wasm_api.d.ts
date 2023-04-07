/* tslint:disable */
/* eslint-disable */
/**
* @param {string} source
* @returns {WasmParserResult}
*/
export function parse_to_context(source: string): WasmParserResult;
/**
*/
export class WasmParserContext {
  free(): void;
/**
* @returns {string}
*/
  print_ast(): string;
}
/**
*/
export class WasmParserError {
  free(): void;
/**
*/
  cursor: number;
/**
*/
  readonly message: string;
}
/**
*/
export class WasmParserResult {
  free(): void;
/**
* @returns {boolean}
*/
  is_context(): boolean;
/**
* @returns {WasmParserContext}
*/
  get_context(): WasmParserContext;
/**
* @returns {WasmParserError}
*/
  get_error(): WasmParserError;
}
