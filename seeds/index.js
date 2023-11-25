const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedholder');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/Camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error"));
db.once("open", ()=>{
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp=new Campground({
            author: '65613690a2fd8ed9f50a1098',
            location: `${cities[random1000].city},  ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab eum, minima sed numquam aliquid deleniti nulla corrupti quae natus esse consequuntur ex adipisci quibusdam odio officia earum sunt tenetur ut!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
});