import React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import { debounce } from 'lodash';

import {
  FormElement,
  FormElementControl,
  FormElementLabel,
  Icon,
  IconSVG,
  Pill,
  PillContainer,
} from '../../';

import { InputRaw } from '../Form/Input';
import { prefixable } from '../../decorators';

export class Lookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      highlighted: null,
      open: false,
      loaded: [],
      selected: this.props.initialSelection,
    };

    this.handleLoad = debounce(this.handleLoad, 500);
    this.handleCreateElement = this.handleCreateElement.bind(this);
  }

  componentDidMount() {
    if (this.props.loadOnMount) {
      this.handleLoad();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!!this.props.onChange && this.state.selected !== nextState.selected) {
      this.props.onChange(nextState.selected);
    }
  }

  /**
   * use standard sprite and if custom icon is used, custom sprite
   */
  getSprite(objectType = '') {
    if (objectType.startsWith('custom')) {
      return 'custom';
    }

    return 'standard';
  }

  // Event Handlers
  handleClickOutside() {
    this.closeList();
  }

  handleLoad(searchTerm) {
    const param = typeof searchTerm === 'string' ? searchTerm : this.state.searchTerm;
    Promise.resolve(this.props.load(param))
      .then((data) => {
        this.setState({ loaded: data });
      });
  }

  handleInputChange(event) {
    this.setState({ searchTerm: event.target.value });
    if (this.props.loadOnChange) {
      this.handleLoad(event.target.value);
    }
  }

  handleInputFocus(e) {
    this.openList();

    if (!!this.props.onFocus) {
      this.props.onFocus(e);
    }

    if (this.props.loadOnFocus) {
      this.handleLoad();
    }
  }

  handleCreateElement(e) {
    // if no result was found and enter was pressed, allow creation of new
    // element
    if (
      this.props.allowCreate &&
      this.props.multi &&
      e.charCode === 13 &&
      this.state.loaded.length === 0
    ) {
      const selected = this.state.selected;
      selected.push({
        id: Date.now(),
        label: e.target.value,
      });
      this.setState({ selected, searchTerm: '', open: false });
    }
  }

  // List Toggles
  toggleList(state) {
    this.setState({ open: state });
  }

  closeList() {
    if (this.state.open) {
      this.toggleList(false);
    }
  }

  openList() {
    // single selection
    if (!this.state.open && !this.props.multi && this.state.selected.length < 1) {
      this.toggleList(true);
    }

    // multi selection
    if (!this.state.open && this.props.multi) {
      this.toggleList(true);
    }
  }

  // Result handlers
  addSelection(item) {
    let selected = this.state.selected;

    if (selected.indexOf(item) === -1) {
      if (this.props.multi) {
        selected = [...selected, item];
      } else {
        selected = [item];
      }

      this.closeList();
    }

    this.setState({ selected, searchTerm: '' });
  }

  removeSelection(item) {
    const selected = this.state.selected.filter(select => select.id !== item.id);

    this.setState({ selected });
  }

  highlightSelection(id) {
    this.setState({ highlighted: id });
  }

  // Elements
  input() {
    // hide single select
    if (!this.props.multi && !this.state.open && this.state.selected.length > 0) {
      return null;
    }

    // hide multi select
    if (this.props.multi && !this.state.open && this.state.selected.length > 0) {
      return null;
    }

    const handleInputChange = this.handleInputChange.bind(this);
    const handleInputFocus = this.handleInputFocus.bind(this);

    if (this.props.emailLayout) {
      return (
        <FormElementControl hasIconRight>
          <input
            className={this.props.prefix(['input--bare', 'input--height'])}
            id={this.props.id}
            type="text"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyPress={this.handleCreateElement}
            value={this.state.searchTerm}
            ref={(input) => { if (input && this.state.open) { input.focus(); } }}
          />
        </FormElementControl>
      );
    }

    return (
      <FormElementControl hasIconRight>
        <InputRaw
          aria-activedescendant={this.state.highlighted}
          aria-expanded={this.state.open}
          iconRight="search"
          value={this.state.searchTerm}
          id={this.props.id}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={this.handleCreateElement}
          placeholder={this.props.placeholder}
          role="combobox"
          isFocused={this.state.open}
        />
      </FormElementControl>
    );
  }

  selections() {
    if (this.state.selected.length < 1) {
      return null;
    }

    const onClick = this.openList.bind(this);

    const selectionPills = this.state.selected.map((item, i) => {
      const sldsClasses = this.props.multi ? null : ['size--1-of-1'];
      const onClose = (e) => {
        e.stopPropagation();
        return this.removeSelection.bind(this, item)();
      };
      const icon =
        item.objectType ? (<Icon sprite={this.getSprite(item.objectType)} icon={item.objectType} />) : undefined;
      return (
        <Pill
          key={i}
          icon={icon}
          id={item.id}
          title={item.label}
          label={item.label}
          onClose={onClose}
          sldsClasses={sldsClasses}
        />
      );
    });

    return (
      <PillContainer bare={this.props.emailLayout} onClick={onClick}>{selectionPills}</PillContainer>
    );
  }

  controls() {
    const hasSelection = this.state.selected.length > 0;

    if (hasSelection) {
      return this.selections();
    }

    return this.input();
  }

  lookupItem(item, i) {
    const addSelection = this.addSelection.bind(this, item);
    const highlightSelection = this.highlightSelection.bind(this, item.id);
    const sldsClasses = ['lookup__item-action', 'media', 'media--center'];

    const renderMeta = () => {
      if (item.meta) {
        return (<span className={this.props.prefix(['lookup__result-meta', 'text-body--small'])}>{item.meta}</span>);
      }

      return null;
    };

    return (
      <li onClick={addSelection} onMouseOver={highlightSelection} key={i}>
        <a className={this.props.prefix(sldsClasses)} role="option">
          <IconSVG sprite={this.getSprite(item.objectType)} icon={item.objectType} />
          <div className={this.props.prefix(['media__body'])}>
            <div className={this.props.prefix(['lookup__result-text'])}>{item.label}</div>
            {renderMeta()}
          </div>
        </a>
      </li>
    );
  }

  lookupItems() {
    const filterDisplayItems = (src, target, prop = 'id') =>
      src.filter(o1 => !target.some(o2 => o1[prop] === o2[prop]));

    if (this.state.loaded.length > 0) {
      const displayItems = filterDisplayItems(this.state.loaded, this.state.selected);
      return displayItems.map((item, i) => this.lookupItem(item, i));
    }

    return null;
  }

  lookupList() {
    const prefix = this.props.prefix;

    if (this.state.open && this.state.loaded.length > 0) {
      return (
        <div className={prefix(['lookup__menu'])} role="listbox">
          <div className={prefix(['lookup__item--label', 'text-body--small'])}>
            {this.props.listLabel}
          </div>
          <ul className={prefix(['lookup__list'])} role="presentation">
            {this.lookupItems()}
          </ul>
        </div>
      );
    }

    return null;
  }

  render() {
    const prefix = this.props.prefix;
    const sldsClasses = [
      'lookup',
      { 'is-open': this.state.open },
    ];

    const scope = this.props.multi ? null : 'single';

    if (this.props.emailLayout) {
      return (
        <div className={prefix(['grid', 'grow', 'p-horizontal--small'])}>
          <label className={prefix(['email-composer__label', 'align-middle'])} htmlFor={this.props.id}>
            {this.props.inputLabel}
          </label>
          <FormElement sldsClasses={sldsClasses} data-select={scope} data-scope={scope}>
            {this.input()}
            {this.selections()}
            {this.lookupList()}
          </FormElement>
        </div>
      );
    }

    return (
      <FormElement sldsClasses={sldsClasses} data-select={scope} data-scope={scope}>
        <FormElementLabel id={this.props.id} label={this.props.inputLabel} />
        {this.input()}
        {this.selections()}
        {this.lookupList()}
      </FormElement>
    );
  }
}

Lookup.defaultProps = {
  initialSelection: [],
  loadOnChange: true,
  multi: false,
  placeholder: 'Search',
};

Lookup.propTypes = {
  /**
   * the prefix function from the prefixable HOC
   */
  prefix: React.PropTypes.func.isRequired,
  /**
   * the id of the input field in the lookup
   */
  id: React.PropTypes.string.isRequired,
  /**
   * the initial selection
   */
  initialSelection: function validateSelection(props, propName, componentName, ...rest) {
    const arrayValidation = React.PropTypes.array(props, propName, componentName, ...rest);

    if (arrayValidation === null && props[propName].length > 1 && !props.multi) {
      return new Error(`${componentName}.initialSelection should not supply multiple selections to a single-item
          lookup`);
    }

    return arrayValidation;
  },
  /**
   * label for the input in the lookup
   */
  inputLabel: React.PropTypes.string.isRequired,
  /**
   * label for the dropdown in the lookup
   */
  listLabel: React.PropTypes.string.isRequired,
  /**
   * load function
   */
  load: React.PropTypes.func.isRequired,
  /**
   * whether load is called on input change
   */
  loadOnChange: React.PropTypes.bool,
  /**
   * whether load is called on input focus
   */
  loadOnFocus: React.PropTypes.bool,
  /**
   * whether load is called on component mount
   */
  loadOnMount: React.PropTypes.bool,
  /**
   * render as a multi lookup
   */
  multi: React.PropTypes.bool,
  /**
   * lookup onchange cb. gets passed the selected-array
   */
  onChange: React.PropTypes.func,
  /**
   * onFocus cb for the input in lookup. gets passed the event
   */
  onFocus: React.PropTypes.func,
  /**
   * renders a different layour without borders (bare) for email docked
   * composer
   */
  emailLayout: React.PropTypes.bool,
  /**
   * placeholder for the input field in lookup
   */
  placeholder: React.PropTypes.string,
  /**
   * if set to true, allows the creation of new elements that were not found
   * during lookups. For example new email addresses.
   * The new entry will not have an object type and the ID will be the current
   * timestamp.
   */
  allowCreate: React.PropTypes.bool,
};

export default prefixable(enhanceWithClickOutside(Lookup));