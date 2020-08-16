require('dotenv').config();

// console.log(process.env.SESSION_SECRET);

var express= require('express');
var cookieParser= require('cookie-parser');
var bodyParser= require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log('we are connected !');
});

var userRoute = require('./routes/user.route');
var authRoute = require('./routes/auth.route');
var productRoute= require('./routes/product.route');
var cartRoute = require('./routes/cart.route');
var transferRoute = require('./routes/transfer.route');


var authMiddleware= require('./middlewares/auth.middleware');
var SessionMiddleware= require('./middlewares/session.middleware');

var app= express();
var port=3000;
app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(SessionMiddleware);

app.set('view engine','pug');
app.set('views','./views');


app.get('/',function(req,res){
    res.render('index',{
        name:'Thành Vĩ'
    });
});

app.use('/users',authMiddleware.requireAuth,userRoute);
app.use('/auth',authRoute);
app.use('/products',productRoute);
app.use('/cart',cartRoute);
app.use('/transfer',authMiddleware.requireAuth,transferRoute);
console.log(process.argv);
app.listen(port,function(){
    console.log("server is listening on port "+port);
});