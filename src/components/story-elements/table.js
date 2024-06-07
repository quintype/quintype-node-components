import React from "react";

function TableHeader(columns = []) {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th>{col}</th>
        ))}
      </tr>
    </thead>
  );
}

export function TableView({ data, columns, className, hasHeader }) {
  return (
    <table className={className}>
      {hasHeader && TableHeader(columns)}
      <tbody>
        {data.map((row) => (
          <tr>
            {row.map((item) => (
              <td>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export class Table extends React.Component {
  constructor(props) { // props.data = {content: '', content-type: 'csv'}
    super(props);
    this.state = {
      tableData: [],
    };
  }

  parseCSVToJson(content) {
    import(/* webpackChunkName: "qtc-parsecsv" */ "papaparse").then(({ parse }) => {
      parse(content, {
        header: false, // with header true, the order of columns in table is not guaranteed, so we will handle the case
        complete: (results) => this._isMounted && this.setState({ tableData: results.data }),
      });
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.parseCSVToJson(this.props.data.content); // csv string
    console.log("aa--qc-tableData", this.state.tableData)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    console.log("aa--qc-nextProps", nextProps)
    if (this.props.data.content !== nextProps.data.content) {
      this.parseCSVToJson(nextProps.data.content);
    }
  }

  render() {
    console.log("aa--qc-tableLength", this.state.tableData.length)
    if (!this.state.tableData.length > 0) {
      return null;
    }

    const [columns, tableData] = this.props.hasHeader
      ? [this.state.tableData[0], this.state.tableData.slice(1)]
      : [[], this.state.tableData];

    const className = `story-element-table-${this.props.id}`;

    return React.createElement(this.props.tableComponent || TableView, {
      hasHeader: this.props.hasHeader,
      data: tableData,
      columns: columns,
      showPageSizeOptions: false,
      showPageJump: false,
      className: className,
    });
  }
}
