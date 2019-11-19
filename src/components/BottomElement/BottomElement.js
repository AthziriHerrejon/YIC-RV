import React from 'react';
import './BottomElement.css';
import KeyValue from './KeyValue/KeyValue';

const bottomElement = (props) => {

    return (
        <div className="bottom-container">
            <div style={{display: 'flex'}}>
            </div>
            <div style={{display: 'flex'}}>
                <KeyValue lhs="Mesa" rhs={props.details[2]} bgcolor="#DDD" color="rgb(127, 142, 156)" />
                <KeyValue lhs="Disponibilidad" rhs={props.details[3]} bgcolor="#4697CE" color="#30415B" />
            </div>
        </div>
    )
}

export default bottomElement;