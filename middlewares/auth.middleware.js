var db= require('../db');

module.exports.requireAuth= function(req,res,next){
    console.log(req.cookies);
    console.log( req.signedCookies);
    if(!req.signedCookies.userId){
        res.redirect('/auth/login');
        return;
    }
    var user= db.get('users').find({ id: req.signedCookies.userId 
    }).value();
    console.log(user);
    if(!user){
        res.redirect('/auth/login');
        return;
    }

    res.locals.user=user;

    next();
};