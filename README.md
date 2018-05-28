# react-xtable

> A React.js datatable component

[![NPM](https://img.shields.io/npm/v/react-xtable.svg)](https://www.npmjs.com/package/react-xtable) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-xtable
```

## Usage

---

```jsx
import React, { Component } from 'react'

import Rtable from 'react-xtable'

const columns = [
  {
    label: 'Name',
    key: 'name',
    Render: element => <span>{element.name}</span>
  },
  { label: 'Age', key: 'age' },
  {
    label: 'Actions',
    key: 'actions',
    Render: element => (
      <span onClick={() => console.log(element)}>
        View
      </span>
    )
  }
]

const data = [{ name: 'Daniela Merlo', age: 22 }]

class Example extends Component {
  render() {
    return (
      <RTable
        data={data}
        columns={columns}
        Loading={() => 'Loading'}
        pagination={10}
        searchPlaceholder="Search"
        emptyText={() => 'No data found :('}
      />
    )
  }
}
```

## Props

| Prop              | Type     | Default | Description                 |
| ----------------- | -------- | ------- | --------------------------- |
| data              | Array    | []      | Data to display             |
| columns           | Array    | []      | Table columns               |
| Loading           | Function |         | Loading indicator           |
| Pagination        | Number   | 50      | Number of elements per page |
| EmptyText         | Function |         | Text to show when no data   |
| searchPlaceholder | Text     | search  | Search input placeholder    |

## Column Options

| Property | Type     | Description                                                                           |
| -------- | -------- | ------------------------------------------------------------------------------------- |
| label    | String   | Column title                                                                          |
| key      | String   | Object key                                                                            |
| Render   | Function | Component to render instead of key value. Returns component with the selected element |

## License

MIT © [bernagl](https://github.com/bernagl)
