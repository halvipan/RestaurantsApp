const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const { Restaurant } = require('./models/model.js')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.get('/restaurant/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    res.render('restaurant', {restaurant})
})

app.get('/', async (req, res) => {
    const restaurants = await Restaurant.findAll({
        include: [{all: true, nested: true}],
        logging: false
    })
    res.render('restaurants', {restaurants})
})

app.listen(3000, () => console.log('web server running on port', 3000))