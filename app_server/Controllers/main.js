const index = function(req, res) {
    res.render('index', { title: 'Express', navbar: getNavbar() });
};

const Login = function(req, res) {
    res.render('Login', { title: 'Login', navbar: getNavbar() });
};

const Register = function(req, res) {
    res.render('Register', { title: 'Register', navbar: getNavbar() });
};

const Homepage = function(req, res) {
    const products = [
        {
            title: 'Audi RS4 18" 9j Alloy',
            price: 399.99,
            oldPrice: 599.99,
            img: 'https://www.lkperformance.co.uk/media/ProductImage/23393/image/resized/listing.jpg'
        },
        {
            title: 'Turbosmart 1.9tdi pd130 turbo',
            price: 999.99,
            oldPrice: 1499.99,
            img: 'https://www.turbosmart.com/wp-content/uploads/2023/11/Turbo-category.jpg'
        },
        {
            title: 'Mk5 Golf R32 Rear Diffuser',
            price: 199.99,
            oldPrice: 399.99,
            img: 'https://cdn11.bigcommerce.com/s-d05bdaopnr/images/stencil/original/x/jb-maxton-mk5-r32-5-21-19-13-1__89183.original.jpg'
        }
    ];

    res.render('Homepage', {
        title: 'Rods and Rotors',
        pageHeader: { title: 'Rods and Rotors', strapline: 'Find your next upgrade!' },
        products,
        navbar: getNavbar()
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

module.exports = {
    index,
    Login,
    Register,
    Homepage
};
