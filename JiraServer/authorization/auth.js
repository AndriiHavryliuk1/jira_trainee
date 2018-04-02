const passport = require("passport");  
const passportJWT = require("passport-jwt");  
const User = require("../api/models/user.js");  
const cfg = require("../config/configuration.js");  
const ExtractJwt = passportJWT.ExtractJwt;  
const Strategy = passportJWT.Strategy;  
const params = {  
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = function() {  
    let strategy = new Strategy(params, function(payload, done) {
        User.findOne({ '_id': payload.id }).exec().then(function(user) {
            if (user) {
                return done(null, {
                    id: user.id
                });
            } else {
                return done(new Error("User not found"), null);
            }
        }, function() {
            return done(new Error("User not found"), null);
        });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};