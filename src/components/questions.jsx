import React, { Component } from 'react'

class questions extends React.Component {
    
    render(){
        const questions = [
        {
            theQuestion: "What's the maximum temperature in Celsius for the water to freeze?",
            theAnswer: [
                {"10": false},
                {"60": false},
                {"-1": false},
                {"0": true},
            ],
        },
        
        {
            theQuestion: "What's the maximum temperature in Celsius for the water to freeze?",
            theAnswer: [
                {"10": false},
                {"60": false},
                {"-1": false},
                {"0": true},
            ],
        },
    ];  

        return ( 
            <div>
                <p>this is</p>
            </div>
        );
    }
}
 
export default questions;