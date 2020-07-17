import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ListView extends Component {
    
    static propTypes = {
        id: PropTypes.string,
        arr: PropTypes.array,
    };
    
    render() {
        
        var ElementArray = [];
        
        for (const [index, value] of this.props.arr.entries()) {
            ElementArray.push(<li>{value}</li> )
        }
        
        return (
            <div>
            <ul>{ElementArray}</ul>
            </div>
        )
            
    }
        
}
    
    export default ListView;