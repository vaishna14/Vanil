const Post = require("../models/post");
const User = require("../models/user")



exports.getPieCharts = (req, res, next) => {
    let fetchedPosts;
    let Completed = 0;
    let InProgress = 0;
    let NotStarted = 0;
    Post.find({}, { status: 1 })
        .then(documents => {
            fetchedPosts = documents;
            documents.map(item => {
                if (item.status === "Completed") {
                    Completed += 1;
                } else if (item.status === "In Progress") {
                    InProgress += 1;
                } else {
                    NotStarted += 1;
                }
            })
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                Completed: Completed,
                InProgress: InProgress,
                NotStarted: NotStarted
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            });
        });
};

exports.getteamsTable = (req, res, next) => {
    const postQuery = Post.find().sort([['userName', -1]]);

    postQuery.then(documents => {
        res.status(200).json({
            message: "Users fetched successfully!",
            documents: documents,
        });
    })
}

exports.getBarCharts = (req, res, next) => {
    let fetchedPosts;
    let Completed = 0;
    let InProgress = 0;
    let NotStarted = 0;
    Post.find({}, { status: 1 })
        .then(documents => {
            fetchedPosts = documents;
            documents.map(item => {
                if (item.status === "Completed") {
                    Completed += 1;
                } else if (item.status === "In Progress") {
                    InProgress += 1;
                } else {
                    NotStarted += 1;
                }
            })
            console.log("bi")
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                Completed: Completed,
                InProgress: InProgress,
                NotStarted: NotStarted
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            });
        });
};

