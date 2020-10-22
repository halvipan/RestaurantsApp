const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const { Restaurant, Menu, Item } = require('./models/model.js')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

app.get('/restaurant/:id/delete', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    await restaurant.destroy()
    res.redirect('/')
})

app.post('/restaurants/create', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})

app.post('/restaurant/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        logging: false 
    })
    await restaurant.update(req.body)
    res.render('restaurant', {restaurant})
})

app.post('/restaurant/:rid/:mid/edit', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.rid,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    const menu = await Menu.findByPk(req.params.mid,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    await menu.update(req.body)
    console.log(restaurant)
    res.render('restaurant', {restaurant})
})

app.post('/restaurant/:rid/:id/additem', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.rid,{ 
        logging: false 
    })
    const menu = await Menu.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    const item = await Item.create(req.body)
    menu.addItem(item)
    res.render('restaurant', {restaurant})
})



app.listen(3000, () => console.log('web server running on port', 3000))