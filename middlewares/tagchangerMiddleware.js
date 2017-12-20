exports.tagchanger = (req, res, next) => {
  if (req.body.tags == undefined || req.body.tags == null) {
    req.body.tags = null;
  }else {
    req.body.tags =  req.body.tags.split(",");console.log('hi');
  }
  next();
}
