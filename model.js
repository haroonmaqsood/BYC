module.exports = {
  
  signup: function (email, username, password, ip, agent, token, cb) {
    var date  = new Date(),
        agent = JSON.stringify(agent);
    db.query("INSERT INTO users SET ?", {email:email, username:username, password:password, ip:ip, agent:agent, token:token, createdDttm:date }, function (err,results) {
      if (err) throw err;
      if (results.insertId)
        return cb(results.insertId);
      return cb(false);
    });
  },

  updateEmail: function (email, id, cb) {   
    db.query("UPDATE users SET email = ?, updatedDttm = NOW() WHERE id = ?", [email, id], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },

  updatePassword: function (password, id, cb) {   
    db.query("UPDATE users SET password = ?, updatedDttm = NOW() WHERE id = ?", [password, id], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },

  stepTwo: function (id, gender, firstName, lastName, hairType, course, lastSalon, lastCutCost, cb) {
    db.query("UPDATE users SET gender = ?, firstName = ?, lastName = ?, hairType = ?, course = ?, lastSalon = ?, lastCutCost = ?, updatedDttm = NOW() WHERE id = ?", [gender, firstName, lastName, hairType, course, lastSalon, lastCutCost, id], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },

  stepTwoComplete: function (id, cb) {

    var date = new Date();
    db.query("UPDATE users SET steptwo = NOW(), updatedDttm = NOW() WHERE id = ?", [id], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },

  getProfile: function (username, cb) {
    db.query("SELECT * FROM users WHERE username = ? LIMIT 1", username, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },
  
  checkEmail: function (email, cb) {
    db.query("SELECT COUNT(*) AS count FROM users WHERE email = ?", email, function (err,results) {
      if (err) throw err;
      return cb(results[0].count);
    });
  },

  checkUsername: function (username, cb) {
    db.query("SELECT COUNT(*) AS count FROM users WHERE username = ?", username, function (err,results) {
      if (err) throw err;
      return cb(results[0].count);
    });
  },

  getProfileById: function (id, cb) {
    db.query("SELECT * FROM users WHERE id = ? LIMIT 1", id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },


  getUsernameFromId: function (user_id, cb) {
    db.query("SELECT username FROM users WHERE id = ?", user_id, function (err,results) { 
      if (err) throw err;
      return cb(results);
    });
  },

  getProfileFromEmail: function (email, cb) {
    db.query("SELECT * FROM users WHERE email = ?", email, function (err,results) { 
      if (err) throw err;
      return cb(results);
    });
  },


  getProfileFromUsername: function (username, cb) {
    db.query("SELECT * FROM users WHERE username = ?", username, function (err,results) { 
      if (err) throw err;
      return cb(results);
    });
  },

  verifySet: function (user_id, id, cb) {
    db.query("SELECT * FROM sets WHERE user_id = ? AND id = ?", [user_id, id], function (err,results) { 
      if (err) throw err;
      return cb(results);
    });
  },

  createSet: function (user_id, token, ip, agent, cb) {

    var date  = new Date(),
        agent = JSON.stringify(agent);
    
    db.query("INSERT INTO sets SET ?", {user_id:user_id, slug:token, ip:ip, agent:agent, createdDttm:date }, function (err,results) {
      if (err) throw err;

      if (results.insertId)
        return cb(results.insertId);
      
      return cb(false);
    });
   
  },

  uploadPicture: function (set_id, picture, position, cb) {
    var date  = new Date();
    db.query("INSERT INTO pictures SET ?", {set_id:set_id, picture:picture, position:position, createdDttm:date }, function (err,results) {
      if (err) throw err;
      if (results.insertId)
        return cb(results.insertId);
      return cb(false);
    });
  },

  updatePicture: function (set_id, position, picture, cb) {
    db.query("UPDATE pictures SET picture = ?, crop = NULL, updatedDttm = NOW() WHERE set_id = ? AND position = ?", [picture, set_id, position], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },

  getPictures: function (set_id, crop, cb) {
    console.log(crop)
    var cropped = 'AND crop IS NOT NULL';
    if (!crop) cropped = 'AND crop IS NULL';

    db.query("SELECT * FROM pictures WHERE set_id = ? "+cropped, set_id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });

  },

  // getPicture: function (id, cb) {
  //   db.query("SELECT * FROM pictures WHERE id = ? ", id, function (err,results) {
  //     if (err) throw err;
  //     return cb(results);
  //   });

  // },


  getMySetBySlugToken: function (user_id, slug, cb) {
    db.query("SELECT * FROM sets WHERE user_id = ? AND slug = ?", [user_id, slug], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getMySetBySetId: function (user_id, id, cb) {
    db.query("SELECT * FROM sets WHERE id = ? AND user_id = ?", [id, user_id], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getSetsByOwner: function (user_id, cb) {
    db.query("SELECT * FROM sets WHERE user_id = ?", user_id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getSetBySlugToken: function (slug, cb) {
    db.query("SELECT * FROM sets WHERE slug = ?", [slug], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getSetByID: function (id, cb) {
    db.query("SELECT * FROM sets WHERE id = ?", id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getSetOwner: function (id, cb) {
    db.query("SELECT user_id FROM sets WHERE id = ?", id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  updateImageTitle: function (title, slug, id, cb) {
    db.query("UPDATE sets SET title = ?, slug = ?, updatedDttm = NOW() WHERE id = ?", [title, slug, id], function (err,results) {

      if (err) throw err;
      cb(results);

    });
  },

  getSetPicturePosition: function (set_id, position, cb) {
    db.query("SELECT * FROM pictures WHERE set_id = ? AND position = ?", [set_id, position], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  updatePictureCrop: function (id, crop, cb) {
    db.query("UPDATE pictures SET crop = ?, updatedDttm = NOW() WHERE id = ?", [crop, id], function (err,results) {
      if (err) throw err;
      cb(results);
    });
  },
  
  getMyPicturesById: function (id, cb) {
    db.query("SELECT * FROM pictures WHERE id = ?", id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },
  

  getSetComments: function (set_id, cb) {

    db.query("SELECT * FROM comments WHERE set_id = ? ORDER BY createdDttm DESC", set_id, function (err,results) {
      // LOG TO SENTRY
      if (err) throw err;
      return cb(results);
    });
  },




  addComment: function (comment, user_id, set_id, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO comments SET ?", {comment:comment, user_id:user_id, set_id:set_id, createdDttm:date }, function (err,results) {
      if (err) throw err;
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },


  followUser: function (follower, following, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO follow SET ?", {follower:follower, following:following, createdDttm:date }, function (err,results) {
      if (err) throw err;
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },

  unfollowUser: function (follower, following, cb) {
    
    db.query("UPDATE follow SET updatedDttm = NOW(), deletedDttm = NOW() WHERE follower = ? AND following = ?", [follower, following], function (err,results) {
      if (err) throw err;
      if (results.affectedRows)
        return cb(results.affectedRows);

      return cb(false);

    });

  },

  followStatus: function (follower, following, cb) {
    db.query("SELECT COUNT(*) AS following FROM follow WHERE deletedDttm IS NULL AND follower = ? AND following = ?", [follower, following], function (err,results) {
      if (err) throw err;
      return cb(results[0].following);
    });
  },




  likeSet: function (user_id, set_id, owner_id, cb) {

    var date  = new Date();
    
    db.query("INSERT INTO likes SET ?", {user_id:user_id, set_id:set_id, owner_id:owner_id, createdDttm:date }, function (err,results) {
      if (err) throw err;
      if (results.insertId)
        return cb(results.insertId);

      return cb(false);

    });
   
  },

  unlikeSet: function (user_id, set_id, cb) {
    
    db.query("UPDATE likes SET updatedDttm = NOW(), deletedDttm = NOW() WHERE user_id = ? AND set_id = ?", [user_id, set_id], function (err,results) {
      if (err) throw err;
      if (results.affectedRows)
        return cb(results.affectedRows);

      return cb(false);

    });

  },

  likeStatus: function (user_id, set_id, cb) {
    db.query("SELECT COUNT(*) AS likeCount FROM likes WHERE deletedDttm IS NULL AND user_id = ? AND set_id = ?", [user_id, set_id], function (err,results) {
      if (err) throw err;
      return cb(results[0].likeCount);
    });
    
  },


  getRecentSets: function (from, too, cb) {
    db.query("SELECT * FROM pictures WHERE crop IS NOT NULL ORDER BY id DESC LIMIT ?, ?", [from, too], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getSetFromUsers: function (users, from, too, cb) {
    if (users.length === 0) return cb(false);
    // ADD this to the pictures before they are shown // AND crop IS NOT NULL
    // Actually no you are forced to crop no?
    db.query("SELECT * FROM sets WHERE user_id IN (?) ORDER BY id DESC LIMIT ?, ?", [users, from, too], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },


  getUserSetLikes: function (owner_id, limit, cb) {
    db.query("SELECT *, count(set_id) AS like_count FROM likes WHERE owner_id = ? GROUP BY set_id ORDER BY like_count DESC LIMIT ?", [owner_id, limit], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },


  countLikes: function (set_id, cb) {
    db.query("SELECT count(*) AS count FROM likes WHERE set_id = ? AND deletedDttm IS NULL", set_id, function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },


  countUserLikes: function (owner_id, cb) {
    db.query("SELECT count(*) AS count FROM likes WHERE owner_id = ?", [owner_id], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  countUserPictures: function (user_id, cb) {
    db.query("SELECT count(*) AS count FROM sets WHERE user_id = ? AND deletedDttm IS NULL", [user_id], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  countUserFollowers: function (user_id, cb) {
    db.query("SELECT count(*) AS count FROM follow WHERE following = ? AND deletedDttm IS NULL", [user_id], function (err,results) {
      if (err) throw err;
      return cb(results);
    });
  },

  getFollowing: function (user_id, cb) {
    db.query("SELECT following FROM follow WHERE follower = ?", user_id, function (err,results) {
      if (err) throw err;
      var result = [];

      for (var i = results.length - 1; i >= 0; i--) {
        result[i] = results[i].following;
      };

      return cb(result);
    });
  },


  updatePassword: function (user_id, newPassword, newToken, cb) {
    
    db.query("UPDATE users SET updatedDttm = NOW(), password = ?, token = ? WHERE id = ?", [newPassword, newToken, user_id], function (err,results) {
      if (err) throw err;
      if (results.affectedRows)
        return cb(results.affectedRows);

      return cb(false);

    });

  },





};
