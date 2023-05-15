/* tslint:disable */
/* eslint-disable */
/**
* @param {string} source
* @returns {WasmParserContext}
*/
export function parse_to_context(source: string): WasmParserContext;
/**
*/
export class WasmParseTree {
  free(): void;
/**
* @returns {Uint32Array}
*/
  get_encoded_tree(): Uint32Array;
/**
* @returns {string}
*/
  get_strings(): string;
}
/**
*/
export class WasmParserContext {
  free(): void;
/**
* @returns {string}
*/
  static token_strings(): string;
/**
* @returns {boolean}
*/
  has_parse_tree(): boolean;
/**
* @returns {WasmParseTree}
*/
  get_parse_tree(): WasmParseTree;
/**
* @returns {string}
*/
  static parse_tree_node_shapes(): string;
/**
* @returns {Uint32Array}
*/
  get_tokens(): Uint32Array;
/**
* @returns {Uint32Array}
*/
  get_errors(): Uint32Array;
}
