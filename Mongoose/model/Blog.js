import mongoose from "mongoose";



const blogSchema = new mongoose.Schema(
    {
        title: String,
        category: String,
        isPublished: Boolean,
        content: String,
        tags: [String],
        comments: [{
            userName: String,
            userComment: String,
            likesCount:Number
        }]
    }
)

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

