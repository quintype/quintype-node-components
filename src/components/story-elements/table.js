import React from "react";

function TableHeader(columns) {
  return <thead>
    <tr>
      {columns.map(col => <th>{col.Header}</th>)}
    </tr>
  </thead>;
}

export function TableView({ data, columns, className, hasHeader }) {
  return <table className={className}>
    {hasHeader && TableHeader(columns)}
    <tbody>
      {data.map(row => <tr>
        {columns.map(col => <td>
          {row[col.Header]}
        </td>)}
      </tr>)}
    </tbody>
  </table>;
}

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  }

  parseCSVToJson(content) {
    import(/* webpackChunkName: "qtc-parsecsv" */ "papaparse").then(({ parse }) => {
      parse(content, {
        header: this.props.hasHeader,
        complete: results => this._isMounted && this.setState({ tableData: results.data })
      });
    })
  }

  componentDidMount() {
    this._isMounted = true;
    this.parseCSVToJson(this.props.data.content);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.content !== nextProps.data.content) {
      this.parseCSVToJson(nextProps.data.content);
    }
  }

  render() {
    if (!this.state.tableData.length > 0) {
      return null;
    }

    const columns = Object.keys(this.state.tableData[0]).map(header => ({
      Header: header,
      accessor: header,
      headerStyle: !this.props.hasHeader ? { display: "none" } : {}
    }));

    const className = `story-element-table-${this.props.id}`;

    return React.createElement(this.props.tableComponent || TableView, {
      hasHeader: this.props.hasHeader,
      data: this.state.tableData,
      columns: columns,
      showPageSizeOptions: false,
      showPageJump: false,
      className: className,
    });
  }
}