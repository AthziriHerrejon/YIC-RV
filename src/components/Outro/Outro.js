import React from 'react';
import './Outro.css';

const outro = (props) => {
    return (
        <div className="outro-container">
            <div className="final-card">
                <h2 style={{ margin: '0 auto', marginBottom: '20px' }}>
                    <span style={{ color: "#4697CE" }}>{props.table}</span>
                    &nbsp;
                    <span>RESERVADO</span>
                </h2>
                <p>
                    <span>NOMBRE:</span>
                    &nbsp;
                    <span style={{ color: "rgb(127, 142, 156)" }}>{props.name}</span>
                </p>
                <p>
                    <span>PISO:</span>
                    &nbsp;
                    <span style={{ color: props.floor==="veg"?"#76CC89":"rgb(232, 111, 104)" }}>
                        {props.floor==="veg"?"VEG":"NON-VEG"}
                    </span>
                </p>
                <p><span>HORA:</span>&nbsp;<span  style={{ color: "rgb(127, 142, 156)" }}>{props.time}</span></p>
                <p><span>ASIENTOS:</span>&nbsp;<span  style={{ color: "rgb(127, 142, 156)" }}>{props.seats}</span></p>
            </div>
        </div>
    )
}

export default outro;