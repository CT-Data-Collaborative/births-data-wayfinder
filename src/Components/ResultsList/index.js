import React, {Component} from 'react';
import ReactTable from 'react-table';
import lookup from '../../data/lookup.json';

class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      columns: null
    };
  }

  getData = (key, newProps) => {
    // TODO: We should replace this w/ an async call to a lambda API.
    const towns = newProps.town;
    const gest = newProps.gestational ? newProps.gestational : 'All';
    const weight = newProps.weight ? newProps.weight : 'All';
    try {
      return towns.map((town) => {
        return lookup[town][weight][gest][key];
      }).reduce((a,b) => {return a.concat(b)});
    } catch (err) {
      console.log('no data');
      return null;
    }
  };

  componentWillReceiveProps(nextProps) {
    const keyMap = {
      'Maternal Age': 'Age',
      'Maternal Race/Ethnicity': 'Race',
      'Marital Status': 'Marital',
      'Maternal Education': 'Education',
      'Smoking during pregnancy': 'Smoking',
      'Initiation of prenatal care': 'Prenatal',
    };

    if (nextProps.town && nextProps.indicatorType) {
      const newDataObject = this.getData(keyMap[nextProps.indicatorType], nextProps);
      const columns = [{
        Header: 'Town',
        accessor: 'Town'
      }, {
        Header: nextProps.indicatorType,
        accessor: 'Variable',
      }];
      if (nextProps.gestational != null) {
        columns.push({
          Header: 'Gestational Age Disaggregation',
          accessor: 'Gestational Age'
        });
      }
      if (nextProps.weight != null) {
        columns.push({
          Header: 'Birth Weight Disaggregation',
          accessor: 'Birth Weight'
        });
      }
      columns.push({
        Header: 'Latest Year Available',
        accessor: 'Latest Year Available',
      });
      columns.push({
        Header: 'Link',
        accessor: 'Link',
        Cell: row => (
          row.value ? <span><a href={row.value}>Link to data</a></span> : <span>No data available</span>
        )
      });
      this.setState({data: newDataObject, columns});
    } else {
      this.setState({data: null, columns: null});
    }
  }

  render() {

    if (this.state.data) {
      const dataList = this.state.data;
      const columns = this.state.columns;

      return <ReactTable
        data={dataList}
        columns={columns}
        className="-striped -highlight"
        defaultPageSize={10}
      />
    }
    else {
      return (<div>No data available.</div>)
    }
  }
}

export default ResultsList;