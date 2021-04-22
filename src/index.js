/**
 * Created by Yongwon on 2021-04-19
 * Email: yongwon0824@naver.com
 */

// const schedule = require("./schedule/index")

const lstmService = require("./service/lstmService")
const lstm = require("./api/lstm")
const upbit = require("./api/upbit")
const preprocessing = require("./api/preprocessing")

async function main(){
    // await lstm.load()
    // await lstmService.predictCoin("KRW-BTC")
    await lstmService.initTrain()
    await lstmService.predictCoin("KRW-BTC")
    //const coinList = await upbit.getAllCoinInfo()
    //전체 코인 예측
    // for(let i in coinList){
    //     await lstmService.predictCoin(coinList)
    // }
}

main()


