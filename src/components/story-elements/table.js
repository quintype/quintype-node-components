import React from "react";
import get from 'lodash/get';


function renderTableBody(hasHeader, { headerFields, headerData }){
  let headerRow = [];
  if(hasHeader) {
    headerRow = [<thead><tr>{headerFields.map(headerField => <th>{headerField}</th>)}</tr></thead>];
  }
  else {
    headerRow = [<tr>{headerFields.map(headerField => <td>{headerField}</td>)}</tr>];
  }
  return headerRow.concat(headerData.map(data => <tr>{headerFields.map(headerField => <td>{data[headerField]}</td>)}</tr>));
}

export function TableView({className, hasHeader, tableModData = {}}) {
  return <table className={className}>{renderTableBody(hasHeader, tableModData)}</table>;
}

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableModData: {
        headerFields : [],
        headerData: []
      },
    };
  }

  formatData(content) {
    const dataArray = content.split(/\n/);
    const headerRowData = get(dataArray, [0], '');
    const headerFields = headerRowData.split(',').map(headerValue => headerValue.trim());
    const dataFields = dataArray.slice(1, dataArray.length - 1);
    const headerData = dataFields.map(dataField => dataField.split(',').reduce((acc, currEle, index) => {
      acc[get(headerFields, [index], '').trim()] = currEle.trim();
      return acc;
    }, {}));

    this.setState({tableModData: { headerFields, headerData }});

    return {
      headerFields,
      headerData
    }
  }

  componentDidMount() {
    this.formatData(this.props.data.content);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.content !== nextProps.data.content) {
      this.formatData(nextProps.data.content);
    }
  }

  render() {
    if (!this.state.tableModData.headerFields.length > 0) {
      return null;
    }

    const className = `story-element-table-${this.props.id}`;

    return React.createElement(this.props.tableComponent || TableView, {
      hasHeader: this.props.hasHeader,
      tableModData: this.state.tableModData,
      showPageSizeOptions: false,
      showPageJump: false,
      className: className,
    });
  }
}
