import User from "../models/user.js";
import Post from "./../models/post.js";

const canUpdateOrDelete = async (req, res, next) => {
    try {
        const post_id = req.params.id;
        const {userId} = req.user;
        const post = await Post.findById(post_id);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({msg: "Authentication invalid!"});
        }
        if (!post) {
            return res.status(400).json({msg: "No posts found!"});
        }
        if (userId === post.postedBy.toString() || user.role === "Admin") {
            next();
            return;
        }
        return res.status(401).json({msg: "Authentication invalid!"});
    } catch (error) {
        console.log("Authentication invalid!");
        return res.status(401).json({msg: "Authentication invalid!"});
    }
};

export default canUpdateOrDelete;
