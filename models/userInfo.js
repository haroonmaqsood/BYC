module.exports = {
  
  signup: function (email, username, password, ip, agent, token, cb) {

    var date  = new Date(),
        agent = JSON.stringify(agent);
    
    db.query("INSERT INTO users SET ?", {email:email, username:username, password:password, ip:ip, agent:agent, token:token, createdDttm:date }, function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;

      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },

  stepTwo: function (id, q1, q2, q3, q4, q5, q6, q7, cb) {
    db.query("UPDATE users SET q1 = ?, q2 = ?, q3 = ?, q4 = ?, q5 = ?, q6 = ?, q7 = ? WHERE id = ?", [q1, q2, q3, q4, q5, q6, q7, id], function (err,results) {

      // LOG TO SENTRY
      if (err) throw err;
      cb(results);
      // if (results)
        // return results.insertId;

      // return false;

    });
  },

  stepTwoComplete: function (id, cb) {

    var date = new Date();
    db.query("UPDATE users SET steptwo = ? WHERE id = ?", [date, id], function (err,results) {

      // LOG TO SENTRY
      if (err) throw err;

      var date = new Date();
      cb(date);

      // if (results)
        // return results.insertId;

      // return false;

    });
  },

  getProfile: function (username, cb) {

    var date = new Date();
    db.query("SELECT * FROM users WHERE username = ? LIMIT 1", username, function (err,results) {

      // LOG TO SENTRY
      if (err) throw err;

      return cb(results);



    });
  },






















};
