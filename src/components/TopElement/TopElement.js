import React from 'react';
import './TopElement.css';
import menu from '../../assets/menu.png';
import Dropdown from '../Dropdown/Dropdown';

const topElement = (props) => {

    let defaultOption = null;

    if( props.floor === "veg" )
        defaultOption = "Escoge un área";
    else if( props.floor === "nonveg" )
        defaultOption = "NON-VEG FLOOR";
    else{}

    return (
        <header>
            <Dropdown defaultOption={defaultOption} options={props.floorOptions} change={props.change} />
            <img src={menu} alt="Ham" />
        </header>
    )
}

export default topElement;