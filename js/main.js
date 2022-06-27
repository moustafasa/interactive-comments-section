import { comment, reply } from "./classes.js";

let jsonFile = "data.json";
fetch(jsonFile)
  .then((data) => data.json())
  .then((data) => {
    for (let i = 0; i < data["comments"].length; i++) {
      // add comments
      let CommentApp = data["comments"][i];
      let currentUser = data["currentUser"].username;
      let Comment = new comment(
        CommentApp.id,
        CommentApp.user.username,
        CommentApp.score,
        CommentApp.content,
        currentUser,
        CommentApp.createdAt
      );
      Comment.add();
      // add replys to this comment
      for (let k = 0; k < CommentApp.replies.length; k++) {
        let replyApp = CommentApp.replies[k];
        let rpl = new reply(
          replyApp.id,
          replyApp.user.username,
          replyApp.score,
          replyApp.content,
          currentUser,
          replyApp.createdAt,
          CommentApp.id,
          CommentApp.user.username
        );
        rpl.add();
      }
    }
  });
