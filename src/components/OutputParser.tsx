import invariant from 'invariant';
import React, { ReactNode } from 'react';
import { ReactElement, useMemo, useState } from 'react';
import styles from '../pages/page.module.css';

const SENTINEL_ID = 0;
type ParserNodeProperty =
  | {
      kind: 'String';
      value: string;
    }
  | {
      kind: 'Node';
      value: number;
    }
  | {
      kind: 'MultiString';
      value: Array<string>;
    }
  | {
      kind: 'MultiNode';
      value: Array<number>;
    }
  | {
      kind: 'None';
      value: null;
    };

type ParseNode = {
  name: string;
  properties: Array<[string, ParserNodeProperty]>;
};

export type ParseNodePropertyMetadata = {
  isNode: boolean;
  multiplicity: 'optional' | 'single' | 'variadic';
  name: string;
};

export type ParseTree = {
  data: Uint32Array;
  internedStrings: Array<string>;
  nodeMetadata: Array<[string, Array<ParseNodePropertyMetadata>]>;
};

function treeRoot(tree: ParseTree): number | null {
  return tree.data.at(-1) ?? null;
}

function treeNode(tree: ParseTree, id: number): ParseNode {
  let curr = id;
  const nodeKindIdx = tree.data[curr++];
  invariant(nodeKindIdx < tree.nodeMetadata.length, 'Bad node kind!');
  const [nodeKind, nodePropertyMetadata] = tree.nodeMetadata[nodeKindIdx];
  const nodeProperties: Array<[string, ParserNodeProperty]> = [];
  // for debugging
  const expectedNumDataNodes = tree.data[curr++];

  for (const property of nodePropertyMetadata) {
    let currProperty: ParserNodeProperty;
    if (property.multiplicity === 'variadic') {
      const count = tree.data[curr++];
      const currPropertyValues: Uint32Array = tree.data.slice(
        curr,
        curr + count
      );
      invariant(
        currPropertyValues.length === count,
        'bad values count (data terminated unexpectedly)'
      );
      curr += count;
      if (property.isNode) {
        currProperty = {
          kind: 'MultiNode',
          value: Array.from(currPropertyValues),
        };
      } else {
        currProperty = {
          kind: 'MultiString',
          value: Array.from(currPropertyValues).map(
            (value) => tree.internedStrings[value]
          ),
        };
      }
    } else {
      const currPropertyValue = tree.data[curr++];
      if (
        property.multiplicity === 'optional' &&
        currPropertyValue === SENTINEL_ID
      ) {
        currProperty = {
          kind: 'None',
          value: null,
        };
      } else {
        if (property.isNode) {
          invariant(
            currPropertyValue !== SENTINEL_ID,
            '[Playground internal error]: Unexpected sentinel node.'
          );
          currProperty = {
            kind: 'Node',
            value: currPropertyValue,
          };
        } else {
          currProperty = {
            kind: 'String',
            value: tree.internedStrings[currPropertyValue],
          };
        }
      }
    }

    nodeProperties.push([property.name, currProperty]);
  }
  invariant(
    curr - id - 2 === expectedNumDataNodes,
    `Bad expected data num nodes! ${expectedNumDataNodes} !== ${curr} - ${
      id + 2
    }`
  );
  return {
    name: nodeKind,
    properties: nodeProperties,
  };
}

function CollapsibleList(props: {
  listChildren: Array<ReactNode>;
  label: string;
  hint: string | null;
}): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const { listChildren, label, hint } = props;

  const ClickableChild = useMemo(() => {
    const toggleExpanded = () =>
      setExpanded((prevExpanded) => {
        return !prevExpanded;
      });
    return (
      <>
        <span className={styles.parserNode_clickable} onClick={toggleExpanded}>
          {label}
        </span>
        {hint && <span className={styles.parserNode_propTag} />}
        {hint && (
          <span
            className={styles.parserNode_clickable}
            style={{ color: 'gray' }}
            onClick={toggleExpanded}
          >
            {hint}
          </span>
        )}
      </>
    );
  }, [label, hint]);

  return (
    <>
      {ClickableChild}
      <ul style={expanded ? {} : { display: 'none' }}>{listChildren}</ul>
    </>
  );
}

type ParseNodeNodeProps = { tree: ParseTree; id: number };

function ParseNodeNode(props: ParseNodeNodeProps): ReactElement {
  const node = treeNode(props.tree, props.id);
  invariant(node != null, 'Unexpected null node (internal parser error)');

  const propertyElements: Array<ReactElement> = node.properties.map(
    ([label, property], idx) => {
      let propValue: ReactElement;
      switch (property.kind) {
        case 'Node': {
          propValue = (
            <>
              <span className={styles.parserNode_propTag}>{label}</span>
              <ParseNodeNode tree={props.tree} id={property.value} />
            </>
          );
          break;
        }
        case 'String': {
          propValue = (
            <>
              <span className={styles.parserNode_propTag}>{label}</span>
              <span className="parserNode_propValueLiteral">
                {property.value}
              </span>
            </>
          );
          break;
        }
        case 'MultiNode': {
          const children: Array<ReactElement> = property.value.map(
            (nodeId, idx) => {
              return (
                <li key={`${idx}_${nodeId}`}>
                  <span className={styles.parserNode_propTag}>
                    {idx.toString()}
                  </span>
                  <ParseNodeNode tree={props.tree} id={nodeId} />
                </li>
              );
            }
          );

          propValue = (
            <CollapsibleList
              listChildren={children}
              label={label}
              hint={`[ ${children.length} ${
                children.length === 1 ? 'element' : 'elements'
              } ]`}
            />
          );
          break;
        }
        case 'MultiString':
          propValue = <div>TODO multistring</div>;
          break;
        case 'None':
          propValue = (
            <>
              <span className={styles.parserNode_propTag}>{label}</span>
              <span className="parserNode_propValueLiteral">[ none ]</span>
            </>
          );
          break;
      }
      // We'll never reorder elements of this array (?)
      return <li key={idx}>{propValue}</li>;
    }
  );

  return (
    <CollapsibleList
      listChildren={propertyElements}
      label={node.name}
      hint={null}
    />
  );
}

export default function OutputParser(props: ParseTree) {
  const root = treeRoot(props);
  invariant(root !== null, 'Bad root!');
  return (
    <ul style={{ padding: 0, margin: 0 }}>
      <ParseNodeNode tree={props} id={root} />
    </ul>
  );
}
