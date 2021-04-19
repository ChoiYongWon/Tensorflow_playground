/**
 * Created by Yongwon on 2021-04-19
 * Email: yongwon0824@naver.com
 */

const fetch = require('node-fetch')


module.exports =  {
    getAllCoinInfo : () => {
        const url = 'https://api.upbit.com/v1/market/all'
        const options = {method: 'GET', qs: {

            }};
        return fetch(url, options).then(data=>data.json()).then(data=>data.map(i=>i.market))
    },

    getCoinInfo : (name) => {
        const url = 'https://api.upbit.com/v1/candles/days?market='+name+'&count=1000'
        const options = {
            method: 'GET',
        };
        return fetch(url, options).then(data=>data.json()).then(data=>data)
    }
}