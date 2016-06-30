import React from 'react';
import { prefixable, variationable } from '../../decorators';
import sortable from './sortable';
import truncatable from './truncatable';
import resizable from './resizable';

export const Cell = (props) => {
  const {
    prefix,
    scope,
    title,
    dataLabel,
    children,
  } = props;

  let element = 'td';
  const elementProps = {};
  const sldsClasses = [];

  if (scope === 'col' || scope === 'row') {
    element = 'th';
    elementProps.scope = scope;
  }

  if (dataLabel) {
    elementProps['data-label'] = dataLabel;
  }

  // Set default title if string is found in table cell or child of table cell (e.g. an <a /> tag)
  if (title) {
    elementProps.title = title;
  } else if (typeof children === 'string') {
    elementProps.title = children;
  } else if (React.isValidElement(children) && typeof children.props.children === 'string') {
    elementProps.title = children.props.children;
  }

  elementProps.className = prefix(sldsClasses, props);

  return (
    React.createElement(element, elementProps, children)
  );
};

Cell.variations = [
  // BUG: This does not work in the current SLDS framework.
  'is-sorted--asc',
  'cell-wrap',
  'cell-shrink',
];

Cell.propTypes = {
  /**
   * only th cells have a scope. Header cells have a col scope, and leading body cells can have a row scope.
   */
  scope: React.PropTypes.oneOf(['col', 'row']),
  /**
   * the prefix function from the prefixable HOC
   */
  prefix: React.PropTypes.func,
  /**
   * main content
   */
  children: React.PropTypes.node,
  /**
   * Override for the cell title attribute
   */
  title: React.PropTypes.string,
  /**
   * data label for accessibility
   */
  dataLabel: React.PropTypes.string,
};

export default prefixable(
  variationable(
    truncatable(
      sortable(
        resizable(Cell)
      )
    )
  )
);