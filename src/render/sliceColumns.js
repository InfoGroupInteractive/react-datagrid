'use strict';

function sliceColumns(props) {

    if (!props.virtualColumnRendering || props.endColIndex === null) {
        return props.columns;
    }

    var cols = props.columns.slice(props.startColIndex, props.endColIndex + 1);

    if (props.fixedColumns.length && props.startColIndex >= props.fixedColumns.length) {
        cols = props.fixedColumns.concat(cols);
    }

    return cols;
}

module.exports = sliceColumns;