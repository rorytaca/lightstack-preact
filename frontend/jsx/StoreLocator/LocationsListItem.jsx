'use strict';

const {h, render, Component} = require('preact');
const {round, filter, isEqual} = require('lodash');

class LocationsListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {index, location, onToggle, selectedLocation} = this.props;
    const isSelected = !!selectedLocation && selectedLocation.id === location.id;

    return (
      <div 
        className={
          "locationsListItem flex bt-l b--moon-gray pointer pv3 ph3 ph4-l" + 
          (!!selectedLocation && selectedLocation.id === location.id ? " bg-white" : "")
        }
        data-ref={location.id} 
        onClick={e=>onToggle(location)}
      >
        <div>
          <h3>{location.title}</h3>
          <p className="mb0">{location.address}</p>
          <p className="mt1">{location.phone}</p>
        </div>
      </div>
    );
  }
}

module.exports = LocationsListItem;