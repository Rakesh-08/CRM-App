import mongoose from "mongoose";
import Blog from "./model/Blog.js";
import User from "./model/User.js";


mongoose.connect("mongodb://127.0.0.1:27017/test");

////// create new document in a collection using mongoose with nodejs

// const article =  Blog.create({

//     title: "Article-99",
//     category: "IT Industry",
//     isPublished: false,
//     content: "information technology is the only industry that not got impacted during covid",
//     tags: ["ToughToSurvive", "booms-recession", "tech-giants"],
//     comments: [{
//         userName: "Rakesh",
//         userComment: "interesting observation",
//         likesCount: 1907
//     }]



// })

/////  await article.save()

         //// reading the existing document from collection

// const firstArticle = await Blog.findOne({ title: 'Article-1' });
// console.log(firstArticle)

      ///// read/get/query the document based on id

// const ItArticle = await Blog.findById("645d2e9096c2b8405f614653").exec();
// // console.log(ItArticle)


//     /// update the document

// ItArticle.title = "Article no. 9999";

//  await ItArticle.save();

// let projectedFields = await Blog.findById("645d2e9096c2b8405f614653","title isPublished comments").exec();
// console.log(projectedFields)

// await Blog.deleteOne({ isPublished: false });


const user1 = User.create({
      name: 'Rakesh Mandal',
      email:'Mandal@gmail.com'
})
