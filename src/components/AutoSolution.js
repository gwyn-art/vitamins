import React, { Component } from 'react'

import {initMakeAllWite} from '../utitlits/vitaminsFunctions'

export default class extends Component {
    constructor (props) {
        super(props)

        this.state = {
            steps: []
        }

        this.updateSolution = this.updateSolution.bind(this)
        this.addRecord = this.addRecord.bind(this)
    }

    updateSolution () {
        this.setState({
            steps: []
        }, () => 
        initMakeAllWite(
            JSON.parse(JSON.stringify(this.props.vitaminsLine)), // Making a deep copy of array
            this.addRecord))
    }

    addRecord (step) {
        const {steps} = this.state
        steps.push(step)
        this.setState(steps)
    }

    render () {
        const 
            {vitaminsLine} = this.props,
            {steps} = this.state
        
        return (
            <div>
                <button
                    onClick = {this.updateSolution}
                    disabled = {!vitaminsLine.length}>
                    Show making all wite steps
                </button>
                {
                    steps.length ? (
                        <div>
                            <button onClick = {() => this.setState({steps: []})}> 
                                Clear 
                            </button>
                            {
                                steps.map(
                                    (step, key) => <p key = {key}>{step}</p>)
                            }
                        </div>
                    ) : null
                }
            </div>
        )
    }
}