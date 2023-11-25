const express= require('express');
const app = express();
const methodOverride =require('method-override');
const path =require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError =require('./utils/ExpressError');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/user');

const Campground = require('./models/campground');
const Review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

mongoose.connect('mongodb://127.0.0.1:27017/Camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error"));
db.once("open", ()=>{
    console.log('Database Connected');
});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshoubbeasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/' , (req, res) =>{
    res.render('home');
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Somthing went wrong'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () =>{
    console.log('portal');
})