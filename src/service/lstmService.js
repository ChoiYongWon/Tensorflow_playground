const coin = require("../api/upbit")
const lstm = require("../api/lstm")
const tf = require('@tensorflow/tfjs')
const preprocessing = require("../api/preprocessing")


module.exports = {
    initTrain : async () => {
        let coinList = await coin.getAllCoinInfo()
        coinList = coinList.filter(name=>name.indexOf("KRW")!=-1)
        const preprocessedData = await preprocessing.firstTrainData(coinList)
        
        const startTime = new Date()
        console.log("학습 시작 ",startTime)
        console.log("학습량",preprocessedData.length,"개의 데이터")

        for(let i in preprocessedData){
            console.log(i,"/",preprocessedData.length,"데이터 학습중")
            console.log("Y값",preprocessedData[i][1])
            await lstm.learn(tf.tensor([preprocessedData[i][0]]), tf.tensor([preprocessedData[i][1]]))
        }
        
        const endTime = new Date()
        console.log("학습 종료 ",endTime)
        console.log("학습 소요 시간", (endTime.getTime() - startTime.getTime())/1000/60,"분")
        lstm.info()
        lstm.save()
    },

    learnNewData : async () => {
        let coins = await coin.getAllCoinInfo()
    },

    predictCoin : async(coinName) => {
        // [시가, 종가, 고가, 저가]
        const preprocessingX = await preprocessing.predictDataX(coinName)
        if(preprocessingX.length===0) return
        const result = lstm.predict(preprocessingX).arraySync()[0][0]
        console.log(coinName,"예측값", result)
    },
}