import React, {Component} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class DropdownFactory extends Component {
  constructor(props) {
    super(props);
    this.state = {choices: this.props.choices}
  };

  render() {
    const menu_choices = this.state.choices.map((choice, i) =>
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

export default DropdownFactory;