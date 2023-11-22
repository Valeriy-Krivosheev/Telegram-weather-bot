const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.BOT_TOKEN;
const bot  = new TelegramApi(token,{polling:true})
const axios = require('axios')
const weatherApiKey = '520b51f4fad9f9af0a446c3a7360a7c5'
const moment= require('moment')


const firstMessage = async (id,info)=>{
    await bot.sendMessage(id,`Привет ${info.from.first_name?info.from.first_name:'Друг'}`)
    await bot.sendMessage(id,'У меня пока еще нет команд и сложного функционала')
    await bot.sendMessage(id,'Но зато ты можешь написать мне название любого населенного пункта. А я дам тебе информацию о текущей погоде')
}
const getMyDate = (date) =>{
return moment(new Date(date * 1000)).format("HH:mm")
}
const getWeatherData =  (name,chatId)=>{
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${weatherApiKey}&lang=ru`)
        .then(async data=> {
           await bot.sendMessage(chatId,`В городе ${data.data.name} сейчас ${data.data.weather[0].description}, температура ${Math.round((data.data.main.temp - 273.15))} градусов цельсия. Жарко это или холодно, каждый решит сам для себя)`)
            await bot.sendAnimation(chatId,`https://openweathermap.org/img/wn/${data.data.weather[0].icon}@2x.png`)
            await bot.sendMessage(chatId,`Ощущается на все ${Math.round((data.data.main.feels_like - 273.15))}. Кто их знает как там для кого ощущается :) Влажность ${data.data.main.humidity}%, а  скорость ветра ${data.data.wind.speed}м/с`)
            await bot.sendMessage(chatId,`Рассвет наступает в ${getMyDate(data.data.sys.sunrise)}, а закат уже в ${getMyDate(data.data.sys.sunset)}`)
            return data
        })
        .catch(()=>{
            bot.sendMessage(chatId,'Произошла ошибка, может быть даже виновник не ты :) Введи название более корректно, или повтори попытку позже')
        })
}

bot.on('message', msg=>{
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start'){
        firstMessage(chatId,msg)
    }
    else{
        getWeatherData(text,chatId)
    }
})