'use strict';

var _ = require('lodash');

// TODO: Add support for non-consecutive column fixing
function sliceColumns(props) {

    if (!props.virtualColumnRendering || props.endColIndex === null) {
        return props.columns;
    }

    var cols = props.columns.slice(props.startColIndex, props.endColIndex + 1);

    if (props.fixedColumns.length) {
        _.remove(cols, function(column) {
            return column.fixed;
        });

        cols = props.fixedColumns.concat(cols);
    }

    return cols;
}

module.exports = sliceColumns;