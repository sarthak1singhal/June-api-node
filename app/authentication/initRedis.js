const redis = require('redis')

const client = redis.createClient(6379,"production-june.kbshs8.0001.aps1.cache.amazonaws.com")

client.on('connect', () => {
    console.log('Client connected to redis...')
})

client.on('ready', () => {
    console.log('Client connected to redis and ready to use...')
})

client.on('error', (err) => {
    console.log(err)
})



client.on('end', () => {
    console.log('Client disconnected from redis')
})


/*
process.on('SIGINT', () => {
        client.quit()
    })     
*/


module.exports = client