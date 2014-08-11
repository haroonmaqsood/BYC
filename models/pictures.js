module.exports = {
  
  uploadPicture: function (user_id, picture, token, ip, agent, cb) {

    var date  = new Date(),
        agent = JSON.stringify(agent);
    
    db.query("INSERT INTO picture SET ?", {user_id:user_id, picture:picture, slug:token, ip:ip, agent:agent, createdDttm:date }, function (err,results) {

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

  getMyPicturesBySlugToken: function (user_id, slug, cb) {

    var date = new Date();
    db.query("SELECT * FROM picture WHERE user_id = ? AND slug = ?", [user_id, slug], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;

      return cb(results);
    });
  },

  getPicturesBySlugToken: function (slug, cb) {

    var date = new Date();
    db.query("SELECT * FROM picture WHERE slug = ?", [slug], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      
      return cb(results);
    });
  },


  updateImageTitle: function (title, slug, cb) {

    var date = new Date();
    db.query("SELECT * FROM picture WHERE slug = ?", [slug], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      
      return cb(results);
    });
  },


















};
