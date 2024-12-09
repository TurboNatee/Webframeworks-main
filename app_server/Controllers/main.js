const request = require('request');
const argon2 = require('argon2');
const User = require('../../app_api/Models/user'); // Import the User model
const apiOptions = {
    server: 'http://localhost:3000',
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://wsrender.onrender.com';
}

const index = function(req, res) {
    res.render('index', {
        title: 'Express',
        navbar: getNavbar(),
        backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
    });
};

const passport = require('passport');

const Login = async function(req, res, next) {
    if (req.method === 'POST') {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err); // If there's an error, pass it to the next middleware
            }

            if (!user) {
                // If no user found or invalid credentials, handle the error
                return res.status(400).send(info.message);  // info.message is from the LocalStrategy callback
            }

            // Successfully authenticated, store user session
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                console.log('User logged in:', user.username);
                res.redirect('/Homepage');  // Redirect to homepage
            });
        })(req, res, next);  // Pass the request to passport.authenticate
    } else {
        res.render('Login', {
            title: 'Login',
            navbar: getNavbar(),
            backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
        });
    }
};




const Register = async function(req, res, next) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        try {
            // Check if the username already exists
            const existingUser = await User.findOne({ username });

            if (existingUser) {
                return res.status(400).send('Username already taken');
            }

            // Hash the password using argon2
            const hashedPassword = await argon2.hash(password);

            // Create the new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,  // Store the hashed password
            });

            // Save the new user to the database
            await newUser.save();

            // Automatically log in the user after registration
            req.login(newUser, (err) => {
                if (err) {
                    return next(err);
                }

                console.log('User registered and logged in:', newUser.username);
                // Redirect to the homepage or desired page after successful registration
                res.redirect('/Homepage');
            });

        } catch (err) {
            console.error('Error in Register:', err);  // Log the full error for debugging
            return res.status(500).send('Error saving user');
        }
    } else {
        res.render('Register', {
            title: 'Register',
            navbar: getNavbar(),
            backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
        });
    }
};

const _renderHomepage = function(req, res, responseBody) {
    const products = Array.isArray(responseBody) ? responseBody : [];
    const isLoggedIn = req.session.userId ? true : false;
    res.render('Homepage', {
        title: 'Rods and Rotors',
        pageHeader: { title: 'Rods and Rotors', strapline: 'Find your next upgrade!' },
        products,
        navbar: getNavbar(),
        backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg',
        isLoggedIn
    });
};

const homelist = function(req, res) {
    const path = '/api/homepage';
    const requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
    };
    request(requestOptions, (err, response, body) => {
        _renderHomepage(req, res, body);
    });
};

// Function to return navbar links and titles
const getNavbar = () => {
    return [
        { title: 'Home', link: '/' },
        { title: 'Login', link: '/login' },
        { title: 'Register', link: '/register' },
        { title: 'Products', link: '/products' },
    ];
};
const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');  // Redirect to login page after logout
    });
};



module.exports = {
    index,
    Login,
    Register,
    homelist,
    Logout
};
