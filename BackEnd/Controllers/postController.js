const db = require("../config/db");

const postHandler = {};

postHandler.createPost = (req, res, next) => {
    let { postDet } = req.body;
    const userID = req.user.id;
    let imgId ="null";
    const insertQuery = "insert into socialmedia.post_table(userID, postDet, imgId, date_time) values(?, ?, ?, now());"
    
    if(!postDet) postDet = "null";
    console.log(req.file);
    if(req.file != undefined) imgId = req.file.filename;

    db.query(insertQuery,[userID, postDet, imgId], (err, results) => {
        if(err){
            next(err);
        } else {
            res.json(results);
        }
    })
}

postHandler.updatePost = (req, res, next) => {
    let { postDet } = req.body;
    const userID = req.user.id;
    const postID = req.params.postID;
    let imgId ="null";
    const searchQuery = "select * from socialmedia.post_table where postID = ? and userID = ?";
    db.query(searchQuery, [postID, userID], (err, results) => {
        if(err){
            next(err);
        } else if(results.length == 0){
            res.status(500).json({message: "post doesn't exist for update"});
        } else{
            if(req.file != undefined){
                imgId = req.file.filename;
            } else{
                imgId = results[0].imgId;
            }
            if(!postDet) postDet = results[0].postDet;

            const updateSQL = "update socialmedia.post_table set postDet = ? , imgId = ? where userID = ? and postID = ?";

            db.query(updateSQL,[postDet,imgId,userID,postID], (err1, results1) => {
                if(err){
                    next(err);
                } else {
                    res.json({message: "Update succsessful"});
                }
            })
        }
    })
}

postHandler.getPost = (req, res, next) => {
    const postID = req.params.postID;
    const searchQuery = `SELECT userName as Author , postDet , imgID , likenumber , date_time
    from socialmedia.userinfo , socialmedia.post_table
    where userinfo.userID = post_table.userID and postID = ? ;`;

    db.query(searchQuery, [postID], (err, results) => {
        if(err){
            next(err);
        } else if(results.length == 0){
            res.json({message: "post doesn't exist get"});
        } else {
            res.status(200).json(results);
        }
    });
}

postHandler.getUsersPost = (req, res, next) => {
    const userID = req.params.userID;
    const searchQuery = `SELECT userName as Author , postDet , imgID , likenumber , date_time
    from socialmedia.userinfo , socialmedia.post_table
    where userinfo.userID = post_table.userID and post_table.userID = ? ;`;

    db.query(searchQuery, [userID], (err, results) => {
        if(err){
            next(err);
        } else if(results.length == 0){
            res.json({message: "post doesn't exist for this user"});
        } else {
            res.status(200).json(results);
        }
    });
}

postHandler.deletePost = (req, res, next) => {
    const postID = req.params.postID;
    const userID = req.user.id;

    const deleteQuery = "DELETE FROM socialmedia.post_table WHERE userID = ? and postID = ?;"

    db.query(deleteQuery, [userID, postID], (err, results) => {
        if(err){
            next(err);
        } else {
            res.json({message: "Delete successfull "});
        }
    })
}

postHandler.followingUserPost = (req, res, next) => {
    const userID = req.user.id;
    const searchQuery = `SELECT userName as Author , postDet , imgID , likenumber , date_time
    from socialmedia.userinfo , socialmedia.post_table 
    where userinfo.userID = post_table.userID and post_table.userID in (select userId from socialmedia.follower_table where followerID = ? );`;

    db.query(searchQuery, [userID], (err, results) => {
        if(err){
            next(err);
        } else {
            res.status(200).json(results);
        }
    })
}

module.exports = postHandler;