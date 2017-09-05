import React, {Component} from 'react';
import {ButtonToolbar, Button} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

import {GESTATIONAL, WEIGHT, INDICATORS, VARIABLE} from './Factors';

import DropdownFactory from './Components/Dropdown';
import ResultsList from './Components/ResultsList';
import lookup from './data/lookup.json';

import './App.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/ClearButton.css';
import 'react-table/react-table.css';


// class ResultsList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: null,
//     };
//   }
//
//   getData = (key, newProps) => {
//     const town = newProps.town;
//     const gest = newProps.gestational;
//     const weight = newProps.weight;
//     try {
//       return lookup[town][weight][gest][key];
//     } catch (err) {
//       console.log('no data');
//       return null;
//     }
//   };
//
//   componentWillReceiveProps(nextProps) {
//     const keyMap = {
//       'Maternal Age': 'Age',
//       'Maternal Race/Ethnicity': 'Race',
//       'Marital Status': 'Marital',
//       'Maternal Education': 'Education',
//       'Smoking during pregnancy': 'Smoking',
//       'Initiation of prenatal care': 'Prenatal',
//     };
//
//     if (nextProps.town && nextProps.weight && nextProps.gestational && nextProps.indicatorType) {
//       const newDataObject = this.getData(keyMap[nextProps.indicatorType], nextProps);
//       this.setState({data: newDataObject});
//     } else {
//       this.setState({data: null});
//     }
//   }
//
//   render() {
//     if (this.state.data) {
//       const dataList = this.state.data;
//       const columns = [{
//         Header: 'Variable',
//         accessor: 'Variable',
//       }, {
//         Header: 'Latest Year Available',
//         accessor: 'Latest Year Available',
//       }, {
//         Header: 'Link',
//         accessor: 'Link',
//         Cell: row => (
//           row.value ? <span><a href={row.value}>Link to data</a></span> : <span>No data available</span>
//         )
//       }];
//       // const listItems = dataList.map((row) =>
//       //   <div>
//       //     <span>Variable: {row.Variable}</span><span> Latest Year Available: {row['Latest Year Available']}</span>
//       //   </div>
//       // );
//       // return (<div>{listItems}</div>)
//       return <ReactTable
//         data={dataList}
//         columns={columns}
//         className="-striped -highlight"
//         defaultPageSize={10}
//       />
//     }
//     else {
//       return (<div>No data available.</div>)
//     }
//   }
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      town: null,
      weight: null,
      gestational: null,
      indicatorType: null,
      disaggregation: null
    }
  };

  updateTown = (town) => {
    if (town === '') {
      this.setState({town: null});
    } else {
      this.setState({town});
    }
  };

  updateGest = (gestational) => {
    this.setState({gestational});
  };

  updateWeight = (weight) => {
    this.setState({weight});
  };

  updateType = (indicatorType) => {
    this.setState({indicatorType})
  };

  updateDisaggregation = (disaggregation) => {
    this.setState({disaggregation})
  };

  filterButtons = () => {
    const filters = ['town', 'weight', 'gestational', 'indicatorType'].map((f) => {
      if (this.state[f]) {
        return {filter: f, value: this.state[f]};
      }
    }).filter((e) => e !== undefined);
    return filters;
  };

  clearFilters = (e) => {
    if (e.filter === 'town') {
      this._typeahead.getInstance().clear()
    }
    ;
    this.setState({[e.filter]: null});
  };

  toggleDisaggregationDropdown = (d) => {
    if (d == null) {
      return <div></div>
    } else if (d === 'Birth Weight') {
      return (<div>
        <h4>4. Filter by specific birth weight</h4>
        <DropdownFactory
          choices={WEIGHT}
          title="Birth Weight"
          onSelect={(weight) => this.updateWeight(weight)}
        />
      </div>)
    } else if (d === 'Gestational Age') {
      return (<div>
        <h4>4. Filter by specific gestational age</h4>
        <DropdownFactory
          choices={GESTATIONAL}
          title="Gestational Age"
          onSelect={(age) => this.updateGest(age)}
        />
      </div>)
    } else {
      return (<div></div>)
    }
  };

  render() {
    const filterChoices = this.filterButtons();
    const disaggregation = this.state.disaggregation;
    const disaggregationDropdown = this.toggleDisaggregationDropdown(disaggregation);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Demo of Birth Data Navigation Widget</h2>
        </div>
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <div className="row">
              <p>In an effort to reduce suppressions for small towns, the Department of Public Health provides 3 and 5
                year averages in addition one year data. Use this tool to find the dataset(s) that will give you the
                most detailed information available at the town level.</p>
              <p>There are 9 datasets that make up the available birth data. In an effort to improve the user
                experience, we created that this tool that enables you to discern what dataset has the information you
                need and then go directly to that dataset.</p>
              <p>Please make the selections as to what dissagregations of the data you're interested in viewing. Please
                note, not all cross-tabulations are available. For example, you can look at each individual maternal
                description by birth weight and gestational age but you cannot look at multiple maternal descriptives at
                a time.</p>
            </div>
            <div className="row">
              <h4>1. Select one or more towns to view data availability for</h4>
              <Typeahead
                onInputChange={(town) => this.updateTown(town)}
                options={Object.keys(lookup)}
                placeholder="Choose a town or city..."
                ref={ref => this._typeahead = ref}
              />
            </div>
            <div className="row">
              <div>
                <h4>2. Choose a maternal variable</h4>
                <DropdownFactory
                  choices={INDICATORS}
                  title="Maternal Descriptive"
                  onSelect={(indicatorType) => this.updateType(indicatorType)}
                />
              </div>
              <div>
                <h4>3. Choose disaggregation</h4>
                <DropdownFactory
                  choices={VARIABLE}
                  title="Disaggregation"
                  onSelect={(disaggregation) => this.updateDisaggregation(disaggregation)}
                />
              </div>
              <div>
                {disaggregationDropdown}
              </div>
            </div>
            <div className="row">
              <ButtonToolbar style={{marginTop: '10px'}}>
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
