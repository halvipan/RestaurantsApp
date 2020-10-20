const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize({ dialect: 'sqlite' , storage: './models/database.db' });


class Restaurant extends Model {}

Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, { sequelize, modelName: 'restaurant' })


class Menu extends Model {}

Menu.init({
    title: DataTypes.STRING,
}, { sequelize, modelName: 'menu' })


class Item extends Model {}

Item.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
}, { sequelize, modelName: 'item' })


Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

Menu.hasMany(Item)
Item.belongsTo(Menu)

module.exports = {
    Restaurant,
    Menu,
    Item,
    sequelize
}