const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Turn this to <true> if you want to get the <req.cookies>
    httpOnly: false,
    // secure: false,
    domain: '127.0.0.1'
  };

  res.cookie('jwt', `${token} ${user._id}`, cookieOptions);

  user.password = undefined;

  // In production we add the {secure: true} to cookie options!

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // 400 for bad request!
      return res.status(400).json({
        status: 'error',
        message: "Vous devriez fournir l'email et le mot de passe."
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.checkPassword(password, user.password))) {
      // 401: unauthorized
      return res.status(401).json({
        status: 'error',
        message: "L'email ou le mot de passe sont incorrectes"
      });
    }

    createSendToken(user, 201, res);
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'Logged Out!', {
    expires: new Date(Date.now() + 1),
    httpOnly: false,
    domain: '127.0.0.1'
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      console.log('[protect - authorization]');
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      console.log('[protect - cookie]');
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous etes pas connecté. Veuillez vous connecter pour accéder!'
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('[protect - decoded] ', decoded);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exist!'
      });
    }

    if (!currentUser.changedPasswordAfter(decoded.iat)) {
      console.log('Password');
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed the password! Please log in again.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    req.user = currentUser;
    return next();
  }

  next();
};
