import React, { Component } from 'react'

import { DropdownButton, MenuItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

class Dropdown extends Component {
	constructor(props, context) {
		super(props, context)

		this.state = {
			value: this.props.value,
			valueName: this.getName(this.props.value)
		}
	}

  option() {
    const parentId = this.props.id
    return (option) => {
      const id = option[this.props.keyField]
      return (<MenuItem key={parentId + '' + id} value={id} eventKey={id}>
          {option[this.props.valueField]}
      </MenuItem>)
    }
  }

  getName(selectedValue) {
    return this.props.options.reduce((result, option) => {
      if (option[this.props.keyField] === selectedValue) {
        return option[this.props.valueField]
      }
      return result
    }, this.props.options[0][this.props.valueField])
  }

  onSelect(selectedValue) {
		const valueName = this.getName(selectedValue)
    this.props.onSelect(selectedValue, valueName)
		this.setState({ value: selectedValue, valueName })
  }

  render() {
    const { id, keyField, valueField, options } = this.props
		const { value, valueName } = this.state

    return (
        <DropdownButton key={id} id={id} onSelect={this.onSelect.bind(this)} value={value} title={valueName}>
          {options.map(this.option(id, keyField, valueField))}
        </DropdownButton>)
  }
}

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  keyField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string
}

export default Dropdown
