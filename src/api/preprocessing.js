const tf = require('@tensorflow/tfjs')
const upbit = require("../api/upbit")


module.exports = {

    /*
    return
    [
    [[],1],
    [[],1],
    [[],1],
    [[],1],
    ]
     */
    firstTrainData : async (coinList) => {
        const result = []
        for(let i in coinList) {
            let coinInfo = await upbit.getCoinInfo(coinList[i], 100)
            if(coinInfo.length<(50+1+1)) return result
            coinInfo.reverse().pop() //시간순서대로 정렬 0이 옛날 데이터, 현재 변동중인 데이터는 삭제
            // console.log(coinInfo)

            //데이터 가공
            //해당 기간동안 제일 고가
            const maxHighPrice = Math.max.apply(null, coinInfo.map(data=>data.high_price))

            const preprocessedDataX = coinInfo.map((data)=>{
                return [data.opening_price/maxHighPrice * 100, data.trade_price/maxHighPrice* 100, data.high_price/maxHighPrice* 100, data.low_price/maxHighPrice* 100]
            })

            const preprocessedDataY = coinInfo.map((data)=>{
                return (data.high_price - data.opening_price) / data.opening_price* 100
            })


            for(let m=50,n=0;m<coinInfo.length;m++,n++){
                const tmp = [preprocessedDataX.slice(n,m), preprocessedDataY[m]]
                //50개씩 자른값과 그 결과값을 push
                result.push(tmp)
            }
            result.sort(()=> Math.random() - 0.5);

        }
        return result
    },

    predictDataX : async (coinName) => {
        let coinInfo = await upbit.getCoinInfo(coinName, 51)
        if(coinInfo.length<(50+1)) return []
        coinInfo.reverse().pop() //시간순서대로 정렬 0이 옛날 데이터, 현재 변동중인 데이터는 삭제

        const maxHighPrice = Math.max.apply(null, coinInfo.map(data=>data.high_price))
        const result = tf.tensor([coinInfo.map((data)=>{
            return [data.opening_price/maxHighPrice * 100, data.trade_price/maxHighPrice* 100, data.high_price/maxHighPrice* 100, data.low_price/maxHighPrice* 100]
        })])
        return result
    }


}