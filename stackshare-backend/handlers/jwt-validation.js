const jwtValidation = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'si2ja91ld8t7zsp36q3x0l'
};

jwtValidation.use(new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const user = await User.findOne({_id: jwtPayload.id});
        return done(null, user || false);
    } catch (err) {
        return done(err, false);
    }
}));
