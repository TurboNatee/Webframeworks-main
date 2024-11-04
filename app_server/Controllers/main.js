const request = require('request');
const apiOptions = {
server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
apiOptions.server = ' https://wsrender.onrender.com'
}





const index = function(req, res) {
    res.render('index', { title: 'Express', navbar: getNavbar(), backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg' });
};

const Login = function(req, res) {
    res.render('Login', { title: 'Login', navbar: getNavbar(), backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg' });
};

const Register = function(req, res) {
    res.render('Register', { title: 'Register', navbar: getNavbar(), backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg' });
};



const _renderHomepage = function(req, res, responseBody) {
    const products = Array.isArray(responseBody) ? responseBody : [];

    res.render('Homepage', {
        title: 'Rods and Rotors',
        pageHeader: { title: 'Rods and Rotors', strapline: 'Find your next upgrade!' },
        products,
        navbar: getNavbar(),
        backgroundImage: 'https://wallpapercave.com/wp/wp3731551.jpg' // Pass background image
    });
};

const homelist = function(req, res){
    const path = '/api/homepage';
    const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
    
    };
    request(requestOptions, (err, response, body) => {
    _renderHomepage(req, res, body);
    }
    );
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

module.exports = {
    index,
    Login,
    Register,
    homelist
};
