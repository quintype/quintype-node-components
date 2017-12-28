import React from "react";
import papa from "papaparse";
import ReactTable from "react-table";
import _ from "lodash";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
    this.parseCSVToJson = this.parseCSVToJson.bind(this);
  }

  parseCSVToJson(content) {
    papa.parse(content, {
      header: this.props.hasHeader,
      complete: results => this.setState({ tableData: results.data })
    });
  }

  componentDidMount() {
    this.parseCSVToJson(this.props.data.content);
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

    const columns = _.chain(this.state.tableData)
      .first()
      .keys()
      .map(header => ({
        Header: header,
        accessor: header,
        headerStyle: !this.props.hasHeader ? { display: "none" } : {}
      }))
      .value();

    const className = `story-element-table-${this.props.id}`;

    return (
      <ReactTable
        data={this.state.tableData}
        columns={columns}
        showPageSizeOptions={false}
        showPageJump={false}
        className={className}
      />
    );
  }
}

export default Table;
