const Post = require("../models/post");
const User = require("../models/user");
const Group = require('../models/group');

exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  
  User.findById(req.userData.userId).then(response => {    
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      time: req.body.time,
      status: req.body.status,
      creator: req.userData.userId,
      userName: response.userName,
      groupName:req.body.groupName,
      createdDate: new Date(),
      InprogressDate: null,
      CompletedDate: null
    });
    User.update({_id:response.id},{$push:{tasks :post}})
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
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
 
  User.findOne({ _id: req.body.id }).then(exist_post => {
    
    if (exist_post) {
        const post = new Post({
          _id: req.body.id,
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          contact: req.body.contact,
          userName: req.body.userName,
          email: req.body.email,
          groupName:req.body.groupName,
        });
     
        User.updateOne({ _id: req.params.id, }, post)
          .then(result => {
            
            if (result.n > 0) {
              res.status(200).json({ message: "Update successful!" });
            } else {
              res.status(401).json({ message: "Not authorized!" });
            }
          })
          .catch(error => {
           
            res.status(500).json({
              message: "Couldn't udpate post!"
            });
          });
      }

    })}


exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = User.find({},{tasks:1,userName:1,groupName:1}).sort([['_id', -1]]);
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

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
  
  Group.find({userCreated: req.params.id}).sort([['_id', -1]]).then(post => {    
    if (post) {
      res.status(200).json({post:post, message: "Group Fetched!" });
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
    groupList:req.body.groupName,
    userCreated:req.body.userId
  })
  group.save().then(createdPost => {
    
    res.status(201).json({
      message: "Group created successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      },
      statusValue:true
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a Group failed!",
      statusValue:false
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
