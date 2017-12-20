
calculateAge = (dob) => {
  let today = new Date();
  let birthdate = new Date(dob);
  let age = today.getFullYear() - birthdate.getFullYear();
  let m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}



exports.agerestriction = (req, res, next) => {
  let dob = req.query.dob;
  req.restriction = false;
  let age = (dob != undefined) ? calculateAge(dob):19 ;
  if (age < 18) {
    req.restriction = true;
  }else{
    req.restriction = false;
  }
  next();
}
