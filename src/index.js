/**
 * Created by Yongwon on 2021-04-19
 * Email: yongwon0824@naver.com
 */

// const schedule = require("./schedule/index")
const coin = require("./api/upbit")
const lstm = require("./api/lstm")
const tf = require('@tensorflow/tfjs')


async function main(){
    // const coinNameInfo = await getAllCoinInfo()
    // for(let i in coinNameInfo){
    //     const coinInfo = await getCoinInfo(coinNameInfo[i])
    //     console.log(coinInfo)
    // }
    const predict_obj = {}
    let coins = await coin.getAllCoinInfo()
    coins = coins.filter(name=>name.indexOf("KRW")!=-1)
    const startTime = new Date()
    console.log("학습 시작 ",startTime)
    for(let i in coins){

        let preprocessingX = []
        let preprocessingY = []
        let coinInfo = await coin.getCoinInfo(coins[i])

        if(coinInfo.length<23){
            console.log(coins[i],"데이터 불충분")
            continue;
        }
        // [시가, 종가, 고가, 저가]
        const maxHighPrice = Math.max.apply(null, coinInfo.map(data=>data.high_price))

        preprocessingX = coinInfo.map((data)=>{
            return [data.opening_price/maxHighPrice * 100, data.trade_price/maxHighPrice* 100, data.high_price/maxHighPrice* 100, data.low_price/maxHighPrice* 100]
        }).reverse()

        preprocessingY = coinInfo.map((data)=>{
            return (data.high_price - data.opening_price) / data.opening_price* 100
        }).reverse()

        // console.log(coins[i])
        // console.log(i,coins[i])
        // lstm.learn(preprocessingX, preprocessingY)
        console.log(coins[i],"학습 시작",i,"/",coins.length)
        for(let m=20,n=0;m<coinInfo.length-1;m++,n++){
            const x = tf.tensor([preprocessingX.slice(n,m)])
            const y = tf.tensor([preprocessingY[m]])
            console.log(m," 20일 의 데이터를 학습한 결과 : ",preprocessingY[m])
            await lstm.learn(x, y)
        }
    }
    const endTime = new Date()
    console.log("학습 종료 ",endTime)
    console.log("학습 소요 시간", (endTime.getTime() - startTime.getTime())/1000/60,"분")
    lstm.info()
    lstm.save()
    for(let i in coins){
        let coinInfo = await coin.getCoinInfo(coins[i])
        if(coinInfo.length<23){
            console.log(coins[i],"데이터 불충분")
            continue;
        }
        // [시가, 종가, 고가, 저가]
        const maxHighPrice = Math.max.apply(null, coinInfo.map(data=>data.high_price))
        const preprocessingX = tf.tensor([coinInfo.map((data)=>{
            return [data.opening_price/maxHighPrice * 100, data.trade_price/maxHighPrice* 100, data.high_price/maxHighPrice* 100, data.low_price/maxHighPrice* 100]
        }).slice(0,20).reverse()])
        const result = lstm.predict(preprocessingX).arraySync()[0][0]
        predict_obj[coins[i]] = result
    }
    const max = Math.max.apply(null, Object.values(predict_obj))
    const maxName = Object.keys(predict_obj).find(key => predict_obj[key] === max);
    console.log("최대값", maxName, max, predict_obj)
}

main()


