/**
 * Created by Yongwon on 2021-04-19
 * Email: yongwon0824@naver.com
 */

require("@tensorflow/tfjs-node")

const tf = require('@tensorflow/tfjs')
const X = tf.input({shape : [50, 4]})
const H1 = tf.layers.lstm({
    units : 50,  activation: 'relu'
}).apply(X)
const Y = tf.layers.dense({units : 1}).apply(H1)

let model = tf.model({
    inputs : X,
    outputs : Y
})

model.compile({
    optimizer : tf.train.adam(),
    loss : tf.losses.meanSquaredError,
})

module.exports = {
    info : ()=> model.summary(),
    learn : (x, y)=>{
        return new Promise((resolve)=>{
            model.fit(x, y, {
                epochs : 50,
                callbacks : {
                    onEpochEnd : (epochs, logs)=>{
                        console.log("epoch",epochs,"logs",Math.sqrt(logs.loss))
                    }
                }
            }).then(()=>{
                resolve()
            })
        })
    },
    save : async ()=>{
        await model.save("file://model")
    },

    load : async () => {
        model = await tf.loadLayersModel('file://model/model.json');
    },
    predict : (x) => {
        return model.predict(x)
    }
}
