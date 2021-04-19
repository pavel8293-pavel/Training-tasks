import './App.css'
import CurrencyInput from './CurrencyInput.js'
import React, { useState, useEffect } from 'react'

const CURRENCY_API = 'https://www.cbr-xml-daily.ru/daily_json.js'

const App = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [valutes, setValutes] = useState([]);
    const [currencyCodes, setCurrencyCodes] = useState([])
    const [inputCurrency, setInputCurrency] = useState('')
    const [outputCurrency, setOutputCurrency] = useState('RUB')
    const [amount, setAmount] = useState('')
    const [inputAmount, setInputAmount] = useState(true)
    const [exchangeRate, setExchangeRate] = useState()


    useEffect(() => {
        fetch(CURRENCY_API)
            .then(response => response.json())
            .then(data => {
                setIsLoaded(true);
                setValutes({
                    "RUB": {
                        Value: 1,
                        Nominal: 1
                    }, ...data.Valute
                });
                setCurrencyCodes(Object.keys(data.Valute))

                const defaultInputCurrency = data.Valute["USD"].CharCode
                const defaultRUBCurrency = 1
                setInputCurrency(defaultInputCurrency)
                setExchangeRate((data.Valute["USD"].Value / data.Valute["USD"].Nominal) / defaultRUBCurrency)

            },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                })
    }, [])

    let toAmount, fromAmount

    if (inputAmount) {
        fromAmount = amount
        toAmount = amount * exchangeRate
    } else {
        fromAmount = amount / exchangeRate
        toAmount = amount
    }

    const SetNewInputCurrency = (e) => {
        setInputCurrency(e.target.value)
        setExchangeRate((valutes[e.target.value].Value / valutes[e.target.value].Nominal) / (valutes[outputCurrency].Value / valutes[outputCurrency].Nominal))
    }

    const SetNewOutputCurrency = (e) => {
        setOutputCurrency(e.target.value)
        setExchangeRate((valutes[inputCurrency].Value / valutes[inputCurrency].Nominal) / (valutes[e.target.value].Value / valutes[e.target.value].Nominal))


    }

    const inputValue = (e) => {
        setAmount(e.target.value)
        setInputAmount(true)
    }


    const outputValue = (e) => {
        setAmount(e.target.value)
        setInputAmount(false)
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <div className="wrapper">
                <h1>Currency converter</h1>
                <div className="currency-container">
                    <CurrencyInput
                        currencyCodes={currencyCodes}
                        currency={inputCurrency}
                        onChangeCurrency={SetNewInputCurrency}
                        amount={fromAmount}
                        valueHandler={inputValue}
                    />
                    <CurrencyInput
                        currencyCodes={currencyCodes}
                        currency={outputCurrency}
                        onChangeCurrency={SetNewOutputCurrency}
                        amount={toAmount}
                        valueHandler={outputValue}
                    />
                </div>
            </div>
        )
    }
}
export default App
