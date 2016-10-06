'use strict';

var _ = require('lodash');

function prependFixedColumns(props, cols) {
    if (!props.fixedColumns.length) {
        return cols;
    }

    var result = cols.slice(0);

    _.remove(result, function(column) {
        return column.fixed;
    });

    result = props.fixedColumns.concat(result);

    return result;
}

function sliceColumns(props) {
    if (!props.virtualColumnRendering || props.endColIndex === null) {
        return props.columns;
    }

    // Prepend fixed columns to the entire column set to handle non-consecutive column fixing
    var cols = prependFixedColumns(props, props.columns);

    cols = cols.slice(props.startColIndex, props.endColIndex + 1);

    // Prepend fixed columns to the sliced set
    cols = prependFixedColumns(props, cols);

    return cols;
}

module.exports = sliceColumns;