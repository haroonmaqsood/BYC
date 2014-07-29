module.exports = {
  
  uploadPicture: function (user_id, picture, ip, agent, cb) {

    var date  = new Date(),
        agent = JSON.stringify(agent);
    
    db.query("INSERT INTO picture SET ?", {user_id:user_id, picture:picture, ip:ip, agent:agent, createdDttm:date }, function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;

      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },


  getPictures: function (user_id, cb) {

    var date = new Date();
    db.query("SELECT * FROM picture WHERE user_id = ?", user_id, function (err,results) {

      // LOG TO SENTRY
      if (err) throw err;

      return cb(results);



    });
  },





















};
