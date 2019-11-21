import React from 'react';
import './TableReservation.css';
import * as firebase from 'firebase';
import _ from 'lodash';
import TopElement from '../../components/TopElement/TopElement'
import MiddleElement from '../../components/MiddleElement/MiddleElement';
import BottomElement from '../../components/BottomElement/BottomElement';
import Intro from '../../components/Intro/Intro';
import Outro from '../../components/Outro/Outro';

class TableReservation extends React.Component {
    
    constructor(props) {
        super(props);
        if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: "AIzaSyDDdfZUSxwL4Y9rLFWa552Ptc12emEHeig",
            authDomain: "restro-contrevien.firebaseapp.com",
            databaseURL: "https://restro-contrevien.firebaseio.com",
            projectId: "restro-contrevien",
            storageBucket: "restro-contrevien.appspot.com",
            messagingSenderId: "642505829277"
          });
        }
      } 

    state = {
        floor: "veg",
        floorOptions: ["Área de fumar", "Área de no fumar"],
        ham: false,
        veg: [
            ['N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
            ['RAJ', '~1M', 'TB1', 'DISPONIBLE', '2'],
            ['RAJ', '~2M', 'TB2', 'DISPONIBLE', '2'],
            ['RAMAN', '~1M', 'TB3', 'DISPONIBLE', '4'],
            ['RAMAN', '~2M', 'TB4', 'DISPONIBLE', '4'],
            ['ZIEK', '~3M', 'TB5', 'DISPONIBLE', '4'],
            ['ZIEK', '~5M', 'TB6', 'DISPONIBLE', '6'],
            ['CLAM', '~5M', 'TB7', 'DISPONIBLE', '8'],
        ],
        nonveg: [
            ['N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
            ['MD', '~1M', 'TB1', 'DISPONIBLE', '2'],
            ['MD', '~2M', 'TB2', 'DISPONIBLE', '2'],
            ['SRI', '~1M', 'TB3', 'DISPONIBLE', '4'],
            ['SRI', '~2M', 'TB4', 'DISPONIBLE', '4'],
            ['SRI', '~3M', 'TB5', 'DISPONIBLE', '4'],
            ['LEE', '~5M', 'TB6', 'DISPONIBLE', '6'],
            ['ATIF', '~5M', 'TB7', 'DISPONIBLE', '8'],
        ],
        name: "Nombre de la reservación",
        nameOK: false,
        bookDate: null,
        booked: false,
        currentReservations: null,
        DISPONIBLEable: 0,
        time: "Hora de llegada",
        seats: "Número de asientos",
        seatsOK: false,
        timeOK: false,
        buttonContent: "Reservación",
        buttonBGColor: "#eee",
        buttonColor: "rgb(127, 142, 156)",
        opacity: 0
    }

    fetchData = (values) => {
        if (this.state.bookDate !== null) {
            let bookingsVal = values;
            let bookings = _(bookingsVal)
            .keys()
            .map(bookingKey => {
                let cloned = _.clone(bookingsVal[bookingKey]);
                cloned.key = bookingKey;
                return cloned;
            })
            .value();
            this.setState({
                currentReservations: bookings
            });
        }
    }

    saveData = () => {
        let dbCon = firebase.database().ref('bookings').child(this.state.bookDate);
        dbCon.push({
            table: this.state[this.state.floor][this.state.DISPONIBLEable][2],
            time: this.state.time,
            floor: this.state.floor,
            name: this.state.name
        });
        this.setState({
            booked: true
        })
    }

    manageTime = () => {
        let bookedHour = parseInt(this.state.time.slice(0,2), 10);
        let temp = [...this.state.currentReservations]
        let tempFloor = [...this.state[this.state.floor]]
        for (let k=0; k<temp.length; k++){
            if (
                temp[k]["floor"]===this.state.floor && 
                (bookedHour > (parseInt(temp[k]["time"].slice(0,2), 10)-2) &&
                 bookedHour < (parseInt(temp[k]["time"].slice(0,2), 10)+2))
            ){
                for (let i=1; i<8; i++){
                    if(tempFloor[i][2]===temp[k]["table"])
                        tempFloor[i][3] = "BOOKED"
                }
            }
            else if (temp[k]["floor"]===this.state.floor && 
                    (bookedHour < (parseInt(temp[k]["time"].slice(0,2), 10)-2) ||
                    bookedHour > (parseInt(temp[k]["time"].slice(0,2), 10)+2)))
            {
                for (let i=1; i<8; i++){
                    if(tempFloor[i][2]===temp[k]["table"])
                        tempFloor[i][3] = "DISPONIBLE"
                }
            }
        }
        this.setState({
            [this.state.floor]: tempFloor
        })
        if(this.state.seatsOK)
            this.DISPONIBLEablityHandler(this.state.seats)
    }

    timeFirst = () => {
        this.setState({
            buttonContent: "ENTER TIME FIRST",
            buttonBGColor: "rgb(232, 111, 104)",
            buttonColor: "#fff",
            opacity: 1
        })
    }

    DISPONIBLEablityHandler = (seats) => {
        let flag = 0;
        for (let i=1; i<8; i++){
            if (this.state[this.state.floor][i][4] === seats && this.state[this.state.floor][i][3] === "DISPONIBLE"){
                this.setState({
                    DISPONIBLEable: i
                });
                flag = 1;
                break;
            }
        }
        if(flag===0){
            alert("No hay mesas con este número de asientos disponibles por ahora:\n1. Trata de cambiar el número de asientos \n2. Trata de cambiar la hora\n3. Carga de nuevo la página si quieres cambiar la hora");
            this.setState({
                DISPONIBLEable: 0
            })
        }
    }

    nameHandler = (e) => {
        let name = e.target.value;
        this.setState({
            name: name,
            nameOK: true
        })
    }

    seatsHandler = (e) => {
        let seats = e.target.value;
        let patt = /\d/;
        if (patt.test(seats) && ["2", "3", "4", "5", "6", "7", "8"].includes(seats)) {
            this.DISPONIBLEablityHandler(seats)
            this.setState({
                seats: seats,
                seatsOK: true,
                buttonContent: "RESERVAR",
                buttonBGColor: "btn-btn-danger",
                buttonColor: "rgb(127, 142, 156)",
                opacity: 0
            })
        }
        else {
            this.setState({
                seats: seats,
                buttonContent: "El máximo por mesa es de 8 personas",
                buttonBGColor: "rgb(232, 111, 104)",
                buttonColor: "#fff",
                opacity: 1
            })
        }
    }

    timeHandler = (e) => {
        let time = e.target.value;
        let patt = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/
        if (patt.test(time)) {
            if (time.length === 4)
                time = "0" + time
            if (parseInt(time.slice(0,2), 10) < 9 || parseInt(time.slice(0,2), 10) >= 23)
                this.setState({
                    time: time,
                    buttonContent: "Abrimos de las 9:00 a las 23:00",
                    buttonBGColor: "rgb(232, 111, 104)",
                    buttonColor: "#fff",
                    opacity: 1
                })
            else if (parseInt(time.slice(0,2), 10) === 21 && parseInt(time.slice(3,5), 10) > 0)
            this.setState({
                time: time,
                buttonContent: "La última reservación es a las 9:00",
                buttonBGColor: "rgb(232, 111, 104)",
                buttonColor: "#fff",
                opacity: 1
            })
            else
                this.setState({
                    time: time,
                    timeOK: true,
                    buttonContent: "RESERVAR",
                    buttonBGColor: "#eee",
                    buttonColor: "rgb(127, 142, 156)",
                    opacity: 0
                })
                this.manageTime()
                
        }
        else {
            this.setState({
                time: time,
                buttonContent: "FORMATO HORA:MINUTOS",
                buttonBGColor: "rgb(232, 111, 104)",
                buttonColor: "#fff",
                opacity: 1
            })
        }
    }

    floorHandler = (floor) => {
        this.setState({
            floor: floor,
            seats: "Número de asientos",
            time: "Hora",
            DISPONIBLEable: 0,
            seatsOK: false,
            timeOK: false
        })
    }
 
    toggleSideDrawer = () => {
        this.setState((prevState) => {
            return {
                ham: !prevState.ham
            }
        })
    }

    setDate = (date) => {
        this.setState({
            bookDate: date
        })
        let app = firebase.database().ref('bookings').child(date);
        app.on('value', snapshot => {
            this.fetchData(snapshot.val());
        });
    }

    render() {
        let view = null
        if (this.state.bookDate === null) {
            view = 
                <div className="container">
                    <Intro setDate={this.setDate} />
                </div>
        }
        else if (this.state.booked === true) {
            view = 
                <div className="container">
                    <Outro name={this.state.name}
                            table={this.state[this.state.floor][this.state.DISPONIBLEable][2]}
                            time={this.state.time}
                            floor={this.state.floor}
                            seats={this.state.seats}/>
                </div>
        }
        else {
            view = 
                <div className="container">
                    <TopElement floor={this.state.floor} floorOptions={this.state.floorOptions} change={this.floorHandler}
                                ham={this.state.ham} sideDrawer={this.toggleSideDrawer} />
                    <MiddleElement seats={this.state.seats} seatsChanged={this.seatsHandler}
                                    defaultSeatsText="Ingresa el número de asientos"
                                    time={this.state.time} timeChanged={this.timeHandler}
                                    defaultTimeText="Ingresa la hora" floor={this.state.floor}
                                    buttonContent={this.state.buttonContent} buttonBGColor={this.state.buttonBGColor}
                                    buttonColor={this.state.buttonColor} opacity={this.state.opacity} nameOK={this.state.nameOK}
                                    seatsOK={this.state.seatsOK} timeOK={this.state.timeOK} timeFirst={this.timeFirst}
                                    name={this.state.name} nameChanged={this.nameHandler} defaultName="Ingresa tu nombre"
                                    book={this.saveData}/>
                    <BottomElement details={this.state[this.state.floor][this.state.DISPONIBLEable]} floor={this.state.floor} />
                </div>
            
        }
        return (
            <div>
                {view}
            </div>
        )
    }
}

export default TableReservation;