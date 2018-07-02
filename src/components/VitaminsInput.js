import React, { Component } from 'react'

export default class extends Component {
    constructor (props) {
        super(props)

        this.state = {
            vitaminLine: [],
            error: false,
            errorMessage: ''
        }
    }

    handleChange (str) {
        const regexp = /(\d+)([W|B|G])/g
        let 
            match = regexp.exec(str),
            result = [],
            prevSides = 2,
            error = false,
            errorMessage = ''

        while (match) {
            const 
                sides = parseInt(match[1]),
                bg = match[2]
            
            if (prevSides !== (sides - 1) || sides < 3) {
                error = true
                errorMessage = 'Broken sides'
                break
            }

            result.push({
                sides: sides,
                bg: bg
            })

            prevSides = sides
            match = regexp.exec(str)
        }

        if (error) {
            this.setState({
                error: true,
                errorMessage: errorMessage
            })
        } else {
            this.setState({
                vitaminLine: result
            })
        }
    }

    refresh () {
        this.setState({
            error: false,
            errorMessage: ''
        })
    }

    render () {
        const {
            error, 
            errorMessage, 
            vitaminLine} = this.state

        return (
            <div>
                <div>
                    <input
                        onChange = {e => (this.refresh(), this.handleChange(e.target.value))}
                    />
                    <button
                        disabled = {error}
                        onClick = {() => this.props.initVitaminsLine(vitaminLine)}> 
                        Init
                    </button>
                    <button
                        onClick = {() => this.props.updateVitaminsLine(vitaminLine)}>
                        Update
                    </button>
                </div>
                {
                    error ? <p className = 'error'> {errorMessage} </p> : null
                }
            </div>
        )
    }
}