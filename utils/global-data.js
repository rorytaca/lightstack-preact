module.exports = (req, res, next) => {
  if (req.err) res.render('error', { error: req.err });

  if (req.app.locals.globalDataInited) {
    next();
  } else {
    req.app.locals.globalDataInited = true;    
    req.app.locals.isProduction = process.env.NODE_ENV === 'production';

    //Build global data logic here

  }
};