'use strict';

require('./index.styl')

//var Guid = require('node-uuid')
var sorty = require('sorty')
var React = require('react')
var ReactDOM = require('react-dom')
var DataGrid = require('./src')
var faker = window.faker = require('faker');
var preventDefault = require('./src/utils/preventDefault')
var dataSet = require('./data-set');

console.log(React.version,' react version');
var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            // return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i + 1,
                // id: Guid.create(),
                grade    : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past(),
                country  : faker.address.country(),
                city  : faker.address.city()
            })
        }

        cache[len] = arr

        return arr
    }
})()

function renderIndex(value, data, row){
    return row.rowIndex
}

var RELOAD = true

var columns = [
    { name: 'index', title: '#', width: 50, render: renderIndex},
    { name: 'country', width: 200},
    { name: 'city', width: 150 },
    { name: 'firstName' },
    { name: 'lastName'  },
    { name: 'email', width: 200 }
]

var ROW_HEIGHT = 30
var LEN = 2000
var SORT_INFO = [{name: 'country', dir: 'asc'}]//[ { name: 'id', dir: 'asc'} ]
var sort = sorty(SORT_INFO)
// var data =  gen(LEN);

/* Pagination Example */
var totalData = gen(LEN);
var pageSize = 50;
/* End Pagination Example */


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.onColumnResize = this.onColumnResize.bind(this);

        // this.state = {data: data};

        /* Pagination Example */
        this.onScroll = this.onScroll.bind(this);
        this.getMoreData = this.getMoreData.bind(this);
        this.state = {data: totalData.slice(0, pageSize-1), maxStartIndex: 24};
        /* End Pagination Example */
    }

    onColumnResize(firstCol, firstSize, secondCol, secondSize) {
        firstCol.width = firstSize
        this.setState({})
    }

    render() {
        return (
            <div className='wrapper'>
                <header> _Header_ </header>
                <div className='main'>
                    <aside>  _Nav_ </aside>
                    <div>
                        <DataGrid
                            ref="dataGrid"
                            idProperty='id'
                            dataSource={this.state.data}
                            sortInfo={SORT_INFO}
                            rowHeight={ROW_HEIGHT}
                            onSortChange={this.handleSortChange}
                            columns={columns}
                            onColumnResize={this.onColumnResize}
                            /* YM360 props */
                            fillEmptyRows={false}
                            onVerticalScroll={this.onScroll}
                            maxStartIndex={this.state.maxStartIndex}
                            totalRowCount={LEN} />
                    </div>
                </div>
                <footer> _Footer_ </footer>
            </div>
        )
    }

    /* Pagination Example */
    onScroll(startIndex, height){
        let visibleRowCount = Math.floor(height/ROW_HEIGHT)
        // let startIndex = Math.floor(pos/ROW_HEIGHT);
        let endIndex = startIndex + visibleRowCount;
        let pageIndex = Math.floor(endIndex/pageSize)

        if(this.state.data.length - endIndex <= pageSize/2) {
            setTimeout(() => this.getMoreData(pageIndex, visibleRowCount), 3000);
        }
    }

    getMoreData(page, visibleRowCount){
        let data = this.state && this.state.data && this.state.data.slice() || [];
        let pageNumber = page + 1;
        let pageStartIndex = pageNumber * pageSize;
        let pageEndIndex = pageStartIndex + pageSize - 1;
        data = data.concat(totalData.slice(pageStartIndex, pageEndIndex));

        let maxStartIndex = (data.length - 1) - visibleRowCount;

        this.setState({data: data, maxStartIndex: maxStartIndex});
    }
    /* End Pagination Example */

    handleSortChange(sortInfo) {
        SORT_INFO = sortInfo
        data = sort(data)
        this.setState({})
    }
}

ReactDOM.render((
    <App />
), document.getElementById('content'))
