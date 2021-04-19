import React from 'react'
import './CurrencyInput.css'

export default function CurrencyInput(props) {
    const currencyCodes = props.currencyCodes
    return (
        <div className="currency-input">
            <input type="number" value={props.amount.toString()}  onChange={props.valueHandler}/>
            <select value={props.currency} onChange={props.onChangeCurrency} >
            <option value="RUB" key="RUB">RUB</option>
                {currencyCodes.map(valute => {
                    return (
                        <option value={valute} key={valute}>
                            {valute}
                        </option>
                    )
                })
                }
            </select>
        </div>
    )
}
