'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var assign = require('object-assign');

module.exports = createReactClass({

    displayName: 'ReactDataGrid.ResizeProxy',

    propTypes: {
        active: PropTypes.bool
    },

    getInitialState: function getInitialState() {
        return {
            offset: 0
        };
    },

    render: function render() {

        var props = assign({}, this.props);
        var state = this.state;

        var style = {};
        var active = props.active;

        if (active) {
            style.display = 'block';
            style.left = state.offset;
        }

        return React.createElement('div', { className: 'z-resize-proxy', style: style });
    }
});