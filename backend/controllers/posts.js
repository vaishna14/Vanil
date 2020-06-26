const Post = require("../models/post");
const User = require("../models/user");
const Group = require('../models/group');

exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.userData.userId);

  User.findById(req.userData.userId).then(response => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      time: req.body.time,
      status: req.body.status,
      creator: req.userData.userId,
      userName: response.userName,
      groupName: req.body.groupName,
      createdDate: new Date().toISOString().split('T')[0],
      InprogressDate: null,
      CompletedDate: null,
      UpdatedDate: new Date().toISOString().split('T')[0]
    });
    User.update({ _id: response.id }, { $push: { tasks: post } })
      .then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Creating a post failed!"
        });
      });
  })
};


exports.updatePost = (req, res, next) => {
  User.findOne({ _id: req.body.id }).then(exist_post => {
    if (exist_post) {
      const post = new User({
        _id: req.params.userId,
        userName: req.body.userName,
        groupName: req.body.groupName,
        tasks: req.body.tasks
      });
      User.updateOne({ _id: req.params.userId }, post)
        .then(result => {
          if (result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: "Couldn't udpate post!"
          });
        });
    }

  })
}

exports.updateMyProfile = (req, res, next) => {
  console.log(req.body);
  User.findOne({ _id: req.body.userId }).then(user => {
    if (user) {
      const post = new User({
        _id: req.body.userId,
        myAvatar: req.body.profile
      })

      User.updateOne({ _id: req.body.userId }, post)
        .then(result => {
          if (result.n > 0) {
            console.log(result)
            res.status(200).json({ message: "Update successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: "Couldn't udpate post!"
          });
        });
    }
  })
}

exports.updateMyPost = (req, res, next) => {


  User.findById(req.params.userId, function (err, user) {
    if (user) {
      var friends = user.tasks;
      (friends.map(item => {
        let array
        if (item._id == req.body.id) {
          item._id = req.body.id,
            item.title = req.body.title,
            item.status = req.body.status
          item.content = req.body.description,
            item.UpdatedDate = new Date().toISOString().split('T')[0];
          if (req.body.status !== "NotStarted") {
            if (req.body.status == "In Progress") {
              item.InprogressDate = new Date().toISOString().split('T')[0]
            } else if (req.body.status == "Completed") {
              item.CompletedDate = new Date().toISOString().split('T')[0];
            }
          }
          else {
            item.NotStartedDate = new Date().toISOString().split('T')[0]

          }
          user.save().then(check => {
            array = check
            User.findByIdAndUpdate({ _id: req.params.userId }, check)
              .then(result => {
                if (result) {
                  res.status(200).json({ message: "Update successful!" });
                } else {
                  res.status(401).json({ message: "Not authorized!" });
                }
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({
                  message: "Couldn't udpate post!"
                });
              });
          });
        }

      }))
    } else {
      res.status(500).json({
        message: "Something went wrong!"
      });
    }

  })

}


exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = User.find({}, { tasks: 1, userName: 1, groupName: 1, myAvatar: 1 }).sort([['_id', -1]]);
  let fetchedPosts;

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      res.status(200).json({
        message: "Posts fetched successfully!",
        details: fetchedPosts,

        // maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getMyPosts = (req, res, next) => {
  // console.log(req.userData.userId);

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = User.find({ _id: req.params.id }, { tasks: 1, userName: 1, groupName: 1 }).sort([['_id', -1]]);
  let fetchedPosts;

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      res.status(200).json({
        message: "Posts fetched successfully!",
        details: documents,

        // maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {

  User.findById(req.params.id)
    .then(post => {

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed..!"
      });
    });
};

exports.getMyPost = (req, res, next) => {
  //  console.log(req.userData.userId);
  let posFount;
  User.findById(req.params.userId)
    .then(post => {
      (post.tasks).map(item => {
        if (item._id == req.params.id) {
          posFount = item
        }
      })
      if (posFount) {
        console.log(posFount);
        res.status(200).json(posFount);
      } else {
        res.status(404).json({ message: "Task not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      // console.log("error");

      res.status(500).json({
        message: "Fetching Task failed..!"
      });
    });
};


exports.deletePost = (req, res, next) => {
  // User.find({ _id: req.params.id, creator: req.userData.userId })
  //   .then(result => {
  //     if (result.n > 0) {
  //       res.status(200).json({ message: "Deletion successful!" });
  //     } else {
  //       res.status(401).json({ message: "Not authorized!" });
  //     }
  //   })
  //   .catch(error => {
  //     res.status(500).json({
  //       message: "Deleting posts failed!"
  //     });
  //   });
  console.log(req.params.userId )
  console.log(req.params.postId )
  User.updateOne({_id:req.params.userId },
    { $pull: { "tasks":{$elemMatch:{"_id": req.params.postId} }} }, function(err, data){
      console.log(err, data);
    })
  //   ,{multi: true} , 
  //   (err) => {
  //     if (err) {
  //       console.log(err);
        
  //       return res.status(401).json({ message: "Could Not Delete!" });
  //     }
  // console.log("hi")

  //     return res.status(200).json({ message: "Update successful!" });
    // }
  // );
};

exports.likePost = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Liked!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Like post failed!"
      });
    });

};


exports.getGroup = (req, res, next) => {

  // Group.find({userCreated: req.params.id}).sort([['_id', -1]]).then(post => {    
  Group.find({}).sort([['_id', -1]]).then(post => {
    if (post) {
      res.status(200).json({ post: post, message: "Group Fetched!" });
    } else {
      res.status(404).json({ message: "Group Fetched failed!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Getting group failed!"
      });
    });

};

exports.addGroup = (req, res, next) => {
  const group = new Group({
    groupList: req.body.groupName,
    userCreated: req.body.userId
  })
  group.save().then(createdPost => {

    res.status(201).json({
      message: "Group created successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      },
      statusValue: true
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Creating a Group failed!",
        statusValue: false
      });
    });
};
exports.deleteGroup = (req, res, next) => {
  Group.deleteOne({ userCreated: req.params.userId, groupList: req.params.groupName })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });



};


exports.barChart = (req, res, next) => {
  Post.find().sort([['_id', -1]]).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Liked!" });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "Like post failed!"
      });
    });

};
