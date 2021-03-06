import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  Button,
  ButtonGroup,
  IconButton,
  PageHeaderBase,
  RecordHome,
  MenuItem,
  ObjectHome
} from '../src';

const stories = storiesOf('PageHeader', module);

const headerButtons = ([
  <Button sprite="utility" icon="add" key="follow" onClick={action()}>Follow</Button>,
  <ButtonGroup key="btngroup">
    <Button>Refresh</Button>
    <Button>Edit</Button>
    <Button>Save</Button>
  </ButtonGroup>,
]);

const titleMenu = [
  <MenuItem key="01">Item 1</MenuItem>,
  <MenuItem key="02">Item 2</MenuItem>,
  <MenuItem key="03">Item 3</MenuItem>,
  <MenuItem key="04" divider>Important last item</MenuItem>,
];

const topButtons = (
  <ButtonGroup>
    <Button>New Lead</Button>
    <IconButton border="filled" sprite="utility" icon="down" />
  </ButtonGroup>
);

const bottomButtons = (
  <ButtonGroup>
    <IconButton
      border="filled"
      title="Charts"
      icon="chart"
      sprite="utility"
    />
    <IconButton
      border="filled"
      title="Filter List"
      icon="filterList"
      sprite="utility"
    />
    <IconButton
      more
      border="filled"
      title="Setting"
      icon="settings"
      sprite="utility"
    />
  </ButtonGroup>
);

stories
  .add('Base', () => (
    <PageHeaderBase
      title={text('Title', 'Rohde Corp - 80,000 Widgets')}
      info={text('Info', 'Mark Jaeckal • Unlimited Customer • 11/13/15')}
      icon={object('Icon', { icon: 'opportunity', sprite: 'standard' })}
    />
  ))
  .add('RecordHome', () => (
    <RecordHome
      title={text('Title', 'Record Title')}
      recordType={text('recordType', 'Record Type')}
      icon={object('Icon', { icon: 'user', sprite: 'standard' })}
      headerButtons={headerButtons}
      detailItems={object('DetailItems', [
        {
          title: 'Field 1',
          content: 'Very important ultra long text that everybody must read!',
        },
        {
          title: 'Field 2',
          content: 'Not so important!',
        },
        {
          title: 'Field 3',
          content: <a>Some Link</a>,
        },
        {
          title: [<span key="heading">very important</span>, (
            <IconButton
              icon="down"
              sprite="utility"
              size="small"
              key="icon"
              onClick={action()}
            />
          )],
          content: 'Whatever',
        },
      ])}
    />
  ))
  .add('ObjectHome', () => (
    <ObjectHome
      title={text('Title', 'My Leads')}
      recordType={text('RecordType', 'Leads')}
      titleMenu={titleMenu}
      topButtons={topButtons}
      info={text('Info', '10 items • sorted by name')}
      icon={object('Icon', { icon: 'user', sprite: 'standard' })}
      bottomButtons={bottomButtons}
      titleMenuAction={(
        <IconButton
          border="filled"
          icon="pin"
          onClick={Function.prototype}
          size="small"
          sprite="utility"
        />
      )}
    />
  ))
  .add('ObjectHome without menu', () => (
    <ObjectHome
      title={text('Title', 'My Leads')}
      icon={object('Icon', { icon: 'user', sprite: 'standard' })}
      recordType={text('RecordType', 'Leads')}
      topButtons={topButtons}
      info={text('Info', '10 items • sorted by name')}
      bottomButtons={bottomButtons}
    />
  ));
