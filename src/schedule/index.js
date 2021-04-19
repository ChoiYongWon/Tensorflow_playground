/**
 * Created by Yongwon on 2021-04-19
 * Email: yongwon0824@naver.com
 */

const schedule = require('node-schedule')

module.exports = schedule.scheduleJob("*/1 * * * * *",function(){
    console.log("실행")
})