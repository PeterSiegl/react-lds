import React from 'react';
import classNames from 'classnames';

function prefixClasses(cssPrefix, sldsClasses = [], props) {
  let prefixed = '';

  const existingSlds = props.sldsClasses || [];

  const classes = classNames(
    [...new Set(
      sldsClasses.concat(existingSlds)
    )]
  );

  prefixed = classes
    .trim()
    .split(/\s+/)
    .map(c => `${cssPrefix}${c}`)
    .join(' ');

  prefixed = props.className !== undefined ? classNames(prefixed, props.className) : prefixed;

  return prefixed;
}

const prefixable = (Component) => {
  const displayName = Component.displayName || Component.name;

  const PrefixedComponent = (props, context) => {
    const injection = Object.assign({}, props);

    injection.prefix = (sldsClasses, originalProps) =>
      prefixClasses(context.cssPrefix, sldsClasses, originalProps);

    return (
      <Component {...injection} />
    );
  };

  if (Component.propTypes && (Component.propTypes.className || Component.propTypes.sldsClasses)) {
    // eslint-disable-next-line no-console
    console.warn(
      `Warning: \`@prefixed()\` is overriding the original \`${displayName}.propTypes.className|sldsClasses\`.`
    );
  }

  PrefixedComponent.displayName = displayName;

  PrefixedComponent.propTypes = Object.assign({}, Component.propTypes, {
    className: React.PropTypes.string,
    sldsClasses: React.PropTypes.array,
  });

  /**
   * Override contextTypes
   */

  if (Component.contextTypes && Component.contextTypes.cssPrefix) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: \`@prefixed()\` is overriding the original \`${displayName}.contextTypes.cssPrefix\`.`);
  }

  PrefixedComponent.contextTypes = Object.assign({}, Component.contextTypes, {
    cssPrefix: React.PropTypes.string,
  });

  return PrefixedComponent;
};

export {
  prefixable as default,
  prefixClasses,
};
