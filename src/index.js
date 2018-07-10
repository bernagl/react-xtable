import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

export default class Datatable extends Component {
  state = {
    selectedCol: 0,
    search: '',
    result: null,
    currentPage: 1,
    searchData: [],
    pages: 0,
    currentData: [],
    order: null
  }

  componentDidMount() {
    this.setDataToState(this.props)
  }

  componentWillReceiveProps(props) {
    props.data !== this.props.data && this.setDataToState(props)
  }

  setDataToState = props => {
    const { columns, data, pagination } = props
    const searchData = data.map(element => {
      let el = ''
      columns.map(col => (el += ` ${element[col.key]}`))
      return el.replace('undefined', '')
    })

    this.stateMiddleware({
      pages: Math.ceil(data.length / pagination),
      result: [...data],
      searchData
    })
  }

  setSelectedCol = selectedCol => {
    this.setState({ selectedCol })
  }

  globalSearch = text => {
    const { data } = this.props
    const { searchData } = this.state
    const result = []
    searchData.map((element, i) => {
      return (
        JSON.stringify(element)
          .toLowerCase()
          .search(text.toLowerCase()) >= 0 && result.push(data[i])
      )
    })
    this.stateMiddleware({
      result,
      search: '',
      currentPage: 1
    })
  }

  sortColumn = ({ key }, o, i) => {
    const { result: r, order: so, selectedCol: sl } = this.state
    const { data } = this.props
    const order = sl === i ? (o === so ? null : o) : o
    const result =
      o === so
        ? [...data]
        : o === 'desc'
          ? r.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))
          : r.sort((a, b) => (a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0))
    this.stateMiddleware({ result, order, currentPage: 1, selectedCol: i })
  }

  searchByColum = text => {
    const { columns, data } = this.props
    const { selectedCol } = this.state
    const { key } = columns[selectedCol]
    this.stateMiddleware({
      result: text
        ? data.filter(
            element => element[key].toLowerCase().search(text) >= 0 && element
          )
        : null,
      search: text
    })
  }

  stateMiddleware = state => {
    const { data: d, callback, pagination } = this.props
    const { result } = this.state
    const data = state.result ? state.result : result ? result : d
    const cp = state.currentPage ? state.currentPage : 1
    const p = state.pages ? state.pages : Math.ceil(data.length / pagination)
    const start = pagination * (cp === 1 ? 0 : cp - 1)
    const end = pagination * cp
    const currentData = data.slice(start, end)
    this.setState({ ...state, currentData, pages: p }, () => callback(data))
  }

  handlePaginate = currentPage => {
    const { pages } = this.state
    this.stateMiddleware({
      currentPage: currentPage <= pages ? currentPage : pages
    })
  }

  render() {
    const {
      columns,
      data,
      search,
      footer,
      header,
      EmptyText,
      Loading,
      searchPlaceholder,
      title
    } = this.props
    const { currentData, currentPage, pages, selectedCol, order } = this.state
    return (
      <div id="btable">
        <div className="table-header">
          {title && <h1 className="title">{title}</h1>}
          {search && (
            <input
              type="text"
              onChange={({ target: { value } }) => this.globalSearch(value)}
              className="global-search-input"
              placeholder={searchPlaceholder}
            />
          )}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th onClick={() => this.setSelectedCol(i)} key={i}>
                    <div className="header-container">
                      <span>{col.label}</span>
                      <br />
                      {!col.Render && (
                        <React.Fragment>
                          <span
                            onClick={() => this.sortColumn(col, 'desc', i)}
                            className={`caret caret-up ${i === selectedCol &&
                              order === 'desc' &&
                              'active'} `}
                          />
                          <span
                            onClick={() => this.sortColumn(col, 'asc', i)}
                            className={`caret caret-down ${i === selectedCol &&
                              order === 'asc' &&
                              'active'}`}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((element, i) => (
                <tr className="table-row" key={i}>
                  {columns.map(({ key, Render }, j) => (
                    <td key={j}>
                      {Render ? <Render {...element} /> : element[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footer && (
          <div className="footer">
            {currentData.length <= 0 &&
              !Loading && (
                <div className="empty-table">
                  <EmptyText />
                </div>
              )}
            {Loading &&
              data.length === 0 && (
                <div className="loading">
                  <Loading />
                </div>
              )}
            <div className="pagination">
              <button
                onClick={() => this.handlePaginate(currentPage - 1)}
                disabled={currentPage - 1 === 0 ? true : false}
              >
                {'<'}
              </button>
              <input
                type="number"
                value={currentPage}
                min="1"
                max={pages}
                onChange={({ target: { value } }) => this.handlePaginate(value)}
              />
              <span className="pagination-total">of {pages}</span>
              <button
                onClick={() => this.handlePaginate(currentPage + 1)}
                disabled={currentPage >= pages ? true : false}
              >
                {'>'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

Datatable.defaultProps = {
  EmptyText: () => <span>No data found</span>,
  Loading: () => <span>Loading</span>,
  pagination: 50,
  header: true,
  search: true,
  footer: true,
  searchPlaceholder: 'Search',
  callback: data => console.log(data)
}

Datatable.propTypes = {
  callback: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.array.isRequired,
  header: PropTypes.bool,
  EmptyText: PropTypes.func,
  footer: PropTypes.bool,
  Loading: PropTypes.func,
  pagination: PropTypes.number,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  title: PropTypes.string
}
