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
    db.query("UPDATE users SET q1 = ?, q2 = ?, q3 = ?, q4 = ?, q5 = ?, q6 = ?, q7 = ?, updatedDttm = NOW() WHERE id = ?", [q1, q2, q3, q4, q5, q6, q7, id], function (err,results) {

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
    db.query("UPDATE users SET steptwo = ?, updatedDttm = NOW() WHERE id = ?", [date, id], function (err,results) {

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


  getUsernameFromId: function (user_id, cb) {
    var query = db.query("SELECT username FROM users WHERE id = ?", user_id);
    query.on('result', function(row) {
        cb(row.username);
    });
  },


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

    db.query("SELECT * FROM picture WHERE slug = ?", [slug], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      
      return cb(results);
    });
  },


  updateImageTitle: function (title, slug, id, cb) {
    db.query("UPDATE picture SET title = ?, slug = ?, updatedDttm = NOW() WHERE id = ?", [title, slug, id], function (err,results) {

      // LOG TO SENTRY
      if (err) throw err;
      cb(results);

    });
  },

  

  getPictureComments: function (picture_id, cb) {

    db.query("SELECT * FROM comments WHERE picture_id = ? ORDER BY createdDttm DESC", [picture_id], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      
      return cb(results);
    });
  },




  addComment: function (comment, user_id, picture_id, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO comments SET ?", {comment:comment, user_id:user_id, picture_id:picture_id, createdDttm:date }, function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;
      console.log(results)
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },


  followUser: function (follower, following, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO follow SET ?", {follower:follower, following:following, createdDttm:date }, function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;
      console.log(results)
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },

  unfollowUser: function (follower, following, cb) {
    
    db.query("UPDATE follow SET updatedDttm = NOW(), deletedDttm = NOW() WHERE follower = ? AND following = ?", [follower, following], function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;
      console.log(results)
      if (results.affectedRows)
        return cb(results.affectedRows);

      return cb(false);

    });

  },

  followStatus: function (follower, following, cb) {
    db.query("SELECT COUNT(*) AS following FROM follow WHERE deletedDttm IS NULL AND follower = ? AND following = ?", [follower, following], function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      return cb(results[0].following);
    });
  },




  likePicture: function (user_id, picture_id, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO like SET ?", {user_id:user_id, picture_id:picture_id, createdDttm:date }, function (err,results) {

      // LOG TO SENTRY 
      // if (err) throw err;
      console.log(results)
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },

  unlikePicture: function (user_id, picture_id, cb) {
    
    db.query("UPDATE like SET updatedDttm = NOW(), deletedDttm = NOW() WHERE user_id = ? AND picture_id = ?", [user_id, picture_id], function (err,results) {

      // LOG TO SENTRY
      // if (err) throw err;
      console.log(results)
      if (results.affectedRows)
        return cb(results.affectedRows);

      return cb(false);

    });

  },

  likeStatus: function (user_id, picture_id, cb) {
    // db.query("SELECT COUNT(*) FROM like", function (err,results) { // , [user_id, picture_id]   // deletedDttm IS NULL AND  //  WHERE user_id = 18 AND picture_id = 35
    //   console.log(results)
    //   // LOG TO SENTRY
    //   if (err) throw err;
    //   return cb(results[0]);
    // });

    // db.query("SELECT * FROM like", function (err,results) {
      db.query("SELECT 1+2 AS LOL", function (err,results) {
      console.log(results)
      // LOG TO SENTRY
      if (err) throw err;
      return cb(results);
    });

  },




















};
