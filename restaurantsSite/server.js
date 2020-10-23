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



app.get('/', async (req, res) => {
    const restaurants = await Restaurant.findAll({
        include: [{all: true, nested: true}],
        logging: false
    })
    res.render('restaurants', {restaurants})
})

app.get('/restaurant/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    res.render('restaurant', {restaurant})
})



app.post('/restaurants/create', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})

app.post('/restaurant/:id/deleterest', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    await restaurant.destroy()
    res.redirect('/')
})

app.post('/restaurant/:id/editrest', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}],
        logging: false 
    })
    await restaurant.update(req.body)
    res.redirect('back')
})



app.post('/restaurant/:id/addmenu', async (req, res) => {
    const menu = await Menu.create(req.body)
    console.log(req.body)
    const restaurant = await Restaurant.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}],
        logging: false 
    })
    restaurant.addMenu(menu)
    res.redirect('back')
})

app.post('/restaurant/:id/deletemenu', async (req, res) => {
    const menu = await Menu.findByPk(req.body.id)
    await menu.destroy()
    const restaurant = await Restaurant.findByPk(req.params.rid,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    res.redirect('back')
})

app.post('/restaurant/:rid/:mid/editmenu', async (req, res) => {
    const menu = await Menu.findByPk(req.params.mid,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    await menu.update(req.body)
    const restaurant = await Restaurant.findByPk(req.params.rid,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    res.redirect('back')
})



app.post('/restaurant/:rid/:id/additem', async (req, res) => {
    const menu = await Menu.findByPk(req.params.id,{ 
        include: [{all : true, nested: true}], 
        logging: false 
    })
    const item = await Item.create(req.body)
    menu.addItem(item)
    res.redirect('back')
})

app.post('/restaurant/:rid/:mid/deleteitem', async (req, res) => {
    const item = await Item.findByPk(req.body.id)
    await item.destroy()
    res.redirect('back')
})



app.listen(3000, () => console.log('web server running on port', 3000))