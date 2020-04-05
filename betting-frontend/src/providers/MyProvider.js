import React, { Component } from 'react';

// first we will make a new context
const MyContext = React.createContext();

// Create an exportable consumer that can be injected into components
export const ExportableContext = MyContext.Consumer

// Then create a provider Component
class MyProvider extends Component {

  constructor(props){
    super(props)
    this.state = { 
      User : [],
      NewTicket : [],
      totalOdd : 1,
      possibleGain : 0,
      money : ''
     }
     this.createNewTicket= this.createNewTicket.bind(this);
     this.refreshTicket= this.refreshTicket.bind(this);
}

async createNewTicket(finalTicket){
  console.log(finalTicket);
  await fetch(`/api/ticket`, {
      method : 'POST',
      headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(finalTicket),
  });
  this.refreshTicket();
}

  refreshTicket(){
    this.setState({ NewTicket: [], totalOdd: 1, possibleGain: 0, money: ''})
  }
  fetchUser = () => {
    fetch('/api/user/1', {})
    .then(body => body.json())
    .then(body => this.setState({User : body}))
    .catch(error => console.log(error)); 
  };
  
  componentDidMount(){
    this.fetchUser()
  }
    render() { 
        return ( 
            <MyContext.Provider value={{
                state: this.state
                ,
                  changeMoneyValue: (newMoneyValue, addingMoney) => {
                    if(newMoneyValue >= 1 && newMoneyValue.toString().search(/\./) === -1 && newMoneyValue.toString().search(/e/) === -1){
                      let newUserState = this.state.User;
                      if(addingMoney){
                        newUserState.money = parseInt(newUserState.money) + parseInt(newMoneyValue);
                      }
                      else{
                        newUserState.money = parseInt(newUserState.money) - parseInt(newMoneyValue);
                      }
                      this.setState({User : newUserState});
                    }
                  },
                  addPair: (odd, type, Odds) => {
                    let finalNewTicket = this.state.NewTicket;
                    let newTotalOdd = this.state.totalOdd * odd;

                    //check if we already bet on that match
                    let pairAlreadyExists = finalNewTicket.filter(pair => pair.odds.match.id === Odds.match.id);

                    //check if we already bet one special match
                    let specialMatchAlreadyExists = finalNewTicket.filter(pair => pair.odds.type === "Special offer" && Odds.type === "Special offer");                    

                    //Divide total odd with odd from match that we are removing
                    pairAlreadyExists.map( pair => {
                      newTotalOdd = newTotalOdd / pair.odd;
                      return pair;
                    })

                    if(pairAlreadyExists.length > 0){
                      finalNewTicket = [...this.state.NewTicket].filter(pair => pair.odds.match.id !== Odds.match.id);
                    }

                    //Divide total odd with odd from match that we are removing
                    specialMatchAlreadyExists.map( pair => {
                      console.log("already special match");
                      newTotalOdd = newTotalOdd / pair.odd;
                      return pair;
                    })

                    if(specialMatchAlreadyExists.length > 0){
                      finalNewTicket = [...this.state.NewTicket].filter(pair => pair.odds.match.id !== Odds.match.id).filter(pair => pair.odds.type !== "Special offer" && Odds.type === "Special offer");
                    }                    

                    const newPossibleGain = this.state.money * newTotalOdd;
                    const newPair = {
                      "odds": Odds,
                      "odd": odd,
                      "type": type
                    };
                      this.setState({ NewTicket: [...finalNewTicket, newPair], totalOdd: newTotalOdd, possibleGain: newPossibleGain})
                  },
                  handleBetMoneyInput: (event) =>{
                    const target= event.target;
                    const newMoneyValue = target.value;
                    //if there are no pairs picked for bet, no need for calculating possible gain
                    //money input must be only integers higher than 1
                    if(this.state.NewTicket.length > 0 && newMoneyValue >= 1 && newMoneyValue.toString().search(/\./) === -1 && newMoneyValue.toString().search(/e/) === -1){
                      const newPossibleGainValue = newMoneyValue * this.state.totalOdd;
                      this.setState({possibleGain: newPossibleGainValue, money : newMoneyValue});
                    }
                  },
                  playTicket: () => {
                    let finalNewTicket = [];
                    //ADD TICKET VALIDATION!!! money etc
                    this.state.NewTicket.map( ticketOdd => {
                      finalNewTicket = [...finalNewTicket, 
                        ticketOdd = {
                        "ticket": {
                          "totalodd": this.state.totalOdd,
                          "possiblegain": this.state.possibleGain,
                          "transaction": {
                              "money": this.state.money,
                                  "user": {
                                  "id": 1
                              }
                          }
                        },
                        "odds": ticketOdd.odds,
                        "odd": ticketOdd.odd,
                        "type": ticketOdd.type
                        }]
                    return null;
                  })
                    this.createNewTicket(finalNewTicket);
                  },
                  isPairSelected: (oddId) => {
                    return this.state.NewTicket.some(pair => pair.odds.id === oddId);
                  },
                  isOddTypeOfPairSelected: (oddId, oddTypeValue) => {
                    return this.state.NewTicket.some(pair => pair.odds.id === oddId && pair.type === oddTypeValue);
                  },
                  deleteNewTicket: () =>{
                    this.refreshTicket();
                  },
                  deletePair: (oddId, odd) => {
                    let newPossibleGain = 0;
                    let newMoneyValue = this.state.money;
                    const newTotalOdd = this.state.totalOdd / odd;
                    newPossibleGain = this.state.money * newTotalOdd;
                    if(newTotalOdd === 1.00){
                      newPossibleGain = 0;
                      newMoneyValue = '';
                    }
                    const finalNewTicket = this.state.NewTicket.filter(pair => pair.odds.id !== oddId);
                    this.setState({ NewTicket: finalNewTicket, totalOdd: newTotalOdd, possibleGain: newPossibleGain, money: newMoneyValue})
                  }
              }}>
                {this.props.children}
              </MyContext.Provider>
         );
    }
}

export default MyProvider;