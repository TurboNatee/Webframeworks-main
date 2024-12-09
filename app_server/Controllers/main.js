const request = require('request');
const argon2 = require('argon2');
const User = require('../../app_api/Models/user');
const passport = require('passport');
const apiOptions = {
    server: process.env.NODE_ENV === 'production' ? 'https://wsrender.onrender.com' : 'http://localhost:3000',
};

// Render index page
const index = (req, res) => {
    const isLoggedIn = !!req.session.username;  // Check if user is logged in
    res.render('index', {
        title: 'Express',
        backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
        isLoggedIn,  // Pass isLoggedIn to the template
    });
};

// Handle login
const Login = (req, res, next) => {
    if (req.method === 'POST') {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(400).send(info.message);
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                // Store the username or user ID in the session
                req.session.username = user.username;
                req.session.isLoggedIn = true;
                res.redirect('/Homepage');
            });
        })(req, res, next);
    } else {
        const isLoggedIn = !!req.session.username;  // Check if user is logged in
        res.render('Login', {
            title: 'Login',
            backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
            isLoggedIn,  // Pass isLoggedIn to the template
        });
    }
};

// Handle registration
const Register = async (req, res, next) => {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).send('Username already taken');

            const hashedPassword = await argon2.hash(password);

            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();

            req.login(newUser, (err) => {
                if (err) return next(err);
                res.redirect('/Homepage');
            });
        } catch (err) {
            return res.status(500).send('Error saving user');
        }
    } else {
        const isLoggedIn = !!req.session.username;  // Check if user is logged in
        res.render('Register', {
            title: 'Register',
            backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
            isLoggedIn,  // Pass isLoggedIn to the template
        });
    }
};

// Render homepage with product list
const _renderHomepage = function(req, res, responseBody) {
    const products = Array.isArray(responseBody) ? responseBody : [];
    const isLoggedIn = !!req.session.username;
    res.render('Homepage', {
        title: 'Rods and Rotors',
        pageHeader: { title: 'Rods and Rotors', strapline: 'Find your next upgrade!' },
        products,
        backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
        isLoggedIn  // Pass isLoggedIn to the template
    });
};

// Fetch and display homepage products
const homelist = (req, res) => {
    const path = '/api/homepage';
    request({ url: apiOptions.server + path, method: 'GET', json: {} }, (err, response, body) => {
        _renderHomepage(req, res, body);
    });
};

// Navbar generation based on session state


// Logout user and destroy session
const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
};

module.exports = {
    index,
    Login,
    Register,
    homelist,
    Logout,
};
