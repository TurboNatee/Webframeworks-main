const register = function(req, res) {
    // Handle user registration logic
    res.status(201).json({ message: 'User registered successfully' });
};

const login = function(req, res) {
    // Handle user login logic
    res.status(200).json({ message: 'User logged in successfully' });
};

module.exports = {
    register,
    login
};
