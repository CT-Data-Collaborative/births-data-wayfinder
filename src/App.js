import React, { Component } from 'react';
import { ButtonToolbar, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import ReactTable from 'react-table';
import { GESTATIONAL, WEIGHT, INDICATORS } from './Factors';
import lookup from './data/lookup.json';
import './App.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/ClearButton.css';
import 'react-table/react-table.css';

class DropdownFactory extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const menu_choices = this.props.choices.map((choice, i) =>
      <MenuItem key={i} eventKey={choice}>{choice}</MenuItem>);

    return (
      <DropdownButton
        bsStyle="primary"
        title={this.props.title}
        id="{title}-selector"
        onSelect={(evt) => this.props.onSelect(evt)}>
        {menu_choices}
      </DropdownButton>
    );
  }
}

class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  getData = (key, newProps) => {
    const town = newProps.town;
    const gest = newProps.gestational;
    const weight = newProps.weight;
    try {
      return lookup[town][weight][gest][key];
    } catch(err) {
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

    if (nextProps.town && nextProps.weight && nextProps.gestational && nextProps.indicatorType) {
      const newDataObject = this.getData(keyMap[nextProps.indicatorType], nextProps);
      this.setState({ data: newDataObject });
    } else {
      this.setState({ data: null });
    }
  }

  render() {
    if (this.state.data) {
      const dataList = this.state.data;
      const columns = [{
        Header: 'Variable',
        accessor: 'Variable',
      }, {
        Header: 'Latest Year Available',
        accessor: 'Latest Year Available',
      }, {
        Header: 'Link',
        accessor: 'Link',
        Cell: row => (
          row.value ? <span><a href={row.value}>Link to data</a></span> : <span>No data available</span>
        )
      }];
      // const listItems = dataList.map((row) =>
      //   <div>
      //     <span>Variable: {row.Variable}</span><span> Latest Year Available: {row['Latest Year Available']}</span>
      //   </div>
      // );
      // return (<div>{listItems}</div>)
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      town: null,
      weight: null,
      gestational: null,
      indicatorType: null
    }
  };

  updateTown = (town) => {
    if (town === '') {
      this.setState({ town: null });
    } else {
      this.setState({ town });
    }
  };

  updateGest = (gestational) => {
    this.setState({ gestational });
  };

  updateWeight = (weight) => {
    this.setState({ weight });
  };

  updateType = (indicatorType) => {
    this.setState({ indicatorType })
  };

  filterButtons = () => {
    const filters = ['town', 'weight', 'gestational', 'indicatorType'].map((f) => {
      if (this.state[f]) {
        return { filter: f, value: this.state[f] };
      }
    }).filter((e) => e !== undefined);
    return filters;
  };

  clearFilters = (e) => {
    if (e.filter == 'town') {
      this._typeahead.getInstance().clear()
    };
    this.setState({ [e.filter]: null });
  };

  render() {
    const filterChoices = this.filterButtons();
    return (
      <div className="App">
        <div className="App-header">
          <h2>Demo of Birth Data Navigation Widget</h2>
        </div>
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <div className="row">
              <Typeahead
                  onInputChange={(town) => this.updateTown(town)}
                  options={Object.keys(lookup)}
                  placeholder="Choose a town or city..."
                  ref={ref => this._typeahead = ref}
              />
            </div>
            <div className="row">
              <ButtonToolbar style={{ marginTop: '10px' }}>
                <DropdownFactory
                  choices={GESTATIONAL}
                  title="Gestational Age"
                  onSelect={(age) => this.updateGest(age)}
                />
                <DropdownFactory
                  choices={WEIGHT}
                  title="Birth Weight"
                  onSelect={(weight) => this.updateWeight(weight)}
                />
                <DropdownFactory
                choices={INDICATORS}
                title="Indicator Type"
                onSelect={(indicatorType) => this.updateType(indicatorType)}
                />
              </ButtonToolbar>
            </div>
            <div className="row">
              <ButtonToolbar style={{ marginTop: '10px' }}>
                {filterChoices.map((e) => {
                  return (<Button
                    key={e.value}
                    onClick={() => this.clearFilters(e)}
                  >{e.value} <sup>x</sup></Button>);
                })}
              </ButtonToolbar>
            </div>
            <div className="row">
              <ResultsList {...this.state}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
