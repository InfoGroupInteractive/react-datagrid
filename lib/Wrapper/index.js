'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Scroller = require('../Scroller');

var _Scroller2 = _interopRequireDefault(_Scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var assign = require('object-assign');


function emptyFn() {}

module.exports = createReactClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft: PropTypes.number,
        scrollTop: PropTypes.number,
        scrollbarSize: PropTypes.number,
        rowHeight: PropTypes.any,
        renderCount: PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            scrollLeft: 0,
            scrollTop: 0
        };
    },

    getInitialState: function getInitialState() {
        return {};
    },

    componentDidMount: function componentDidMount() {
        /* YM360 IL-291: fill empty space with blank rows */
        this.setState({ height: ReactDOM.findDOMNode(this).offsetHeight });
        window.addEventListener('resize', this._handleResize);
        /** END YM360 */
    },

    componentWillUnmount: function componentWillUnmount() {
        /* YM360 IL-291: fill empty space with blank rows */
        window.removeEventListener('resize', this._handleResize);
        /** END YM360 */
    },

    onMount: function onMount(scroller) {
        ;(this.props.onMount || emptyFn)(this, scroller);
    },

    render: function render() {

        var props = this.prepareProps(this.props);
        var rowsCount = props.renderCount;

        var groupsCount = 0;
        if (props.groupData) {
            groupsCount = props.groupData.groupsCount;
        }

        rowsCount += groupsCount;

        // var loadersSize = props.loadersSize
        var verticalScrollerSize = (props.totalLength + groupsCount) * props.rowHeight; // + loadersSize


        /* YM360 IL-291: fill empty space with blank rows */
        // var content = props.empty
        //     ? <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div>
        //     : <div {...props.tableProps} ref="table"/>
        var content;
        if (props.empty && props.fillEmptyRows) {
            content = React.createElement(
                'div',
                _extends({}, props.tableProps, { ref: 'table' }),
                this.fillEmptyRows()
            );
        } else if (props.empty) {
            content = React.createElement(
                'div',
                { className: 'z-empty-text', style: props.emptyTextStyle },
                props.emptyText
            );
        } else if (props.fillEmptyRows) {
            content = React.createElement('div', _extends({}, props.tableProps, { children: props.tableProps.children.concat(this.fillEmptyRows()), ref: 'table' }));
        } else {
            content = React.createElement('div', _extends({}, props.tableProps, { ref: 'table' }));
        }
        /* END YM360 */

        return React.createElement(
            _Scroller2.default,
            {
                onMount: this.onMount,
                preventDefaultHorizontal: true,

                loadMask: !props.loadMaskOverHeader,
                loading: props.loading,

                scrollbarSize: props.scrollbarSize,

                minVerticalScrollStep: props.rowHeight,
                scrollTop: props.scrollTop,
                scrollLeft: props.scrollLeft,

                scrollHeight: verticalScrollerSize,
                scrollWidth: props.minRowWidth,

                onVerticalScroll: this.onVerticalScroll,
                onHorizontalScroll: this.onHorizontalScroll
            },
            content
        );
    },

    onVerticalScrollOverflow: function onVerticalScrollOverflow() {},

    onHorizontalScrollOverflow: function onHorizontalScrollOverflow() {},

    onHorizontalScroll: function onHorizontalScroll(scrollLeft) {
        this.props.onScrollLeft(scrollLeft);
    },

    onVerticalScroll: function onVerticalScroll(pos) {
        /* YM360 HAD-5387: Items Browser Optimization */
        // this.props.onScrollTop(pos)
        this.props.onScrollTop(pos, this.state.height);
        /* End YM360 */
    },

    /* YM360 IL-291: fill empty space with blank rows */
    fillEmptyRows: function fillEmptyRows() {
        var emptyPixels = 0;
        var numEmptyRows = 0;
        var emptyRows = [];
        var emptyCells = [];
        var height = this.state.height !== 0 && this.state.height;
        var rowClass, cellClass, cellWidth, rowHeight, offset;
        var cols = this.props.columns;

        if (height > this.props.renderCount * this.props.rowHeight) {
            emptyPixels = height - (this.props.renderCount - 1) * this.props.rowHeight;
            numEmptyRows = Math.ceil(emptyPixels / this.props.rowHeight);

            for (var i = 0; i < numEmptyRows; i++) {
                emptyCells = [];
                rowClass = 'z-row z-empty-row';
                offset = this.props.renderCount - 1 + i;

                rowClass += offset % 2 ? ' z-odd' : ' z-even';
                rowHeight = { height: this.props.rowHeight };

                for (var j = 0; j < cols.length; j++) {
                    cellClass = 'z-cell';

                    if (j === 0) {
                        cellClass += ' z-first';
                    }
                    if (j === cols.length - 1) {
                        cellClass += ' z-last';
                    }

                    cellWidth = cols[j].width ? assign({ width: cols[j].width, minWidth: cols[j].width }, { width: cols[j].sizeStyle.width, minWidth: cols[j].sizeStyle.width }) : { minWidth: cols[j].minWidth, WebkitFlex: 1, msFlex: 1, flex: 1 };

                    emptyCells.push(React.createElement('div', { key: j, className: cellClass, style: cellWidth }));
                }

                emptyRows.push(React.createElement(
                    'div',
                    { key: offset, className: rowClass, style: rowHeight, onClick: this._onEmptyRowClick },
                    emptyCells
                ));
            }
        }

        return emptyRows;
    },
    /* END YM360 */

    prepareProps: function prepareProps(thisProps) {
        var props = {};

        assign(props, thisProps);

        return props;
    },

    /* YM360 IL-291: fill empty space with blank rows */
    _handleResize: function _handleResize() {
        this.setState({ height: ReactDOM.findDOMNode(this).offsetHeight });
    },
    /* END YM360 */

    /* YM360 HAD-2495: deselect selected row */
    _onEmptyRowClick: function _onEmptyRowClick(e) {
        if (typeof this.props.onEmptyRowClick === 'function') {
            this.props.onEmptyRowClick(e);
        }
    }
    /* END YM360 */
});