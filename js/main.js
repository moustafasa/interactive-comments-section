import { comment } from "./classes.js";
fetch("data.json")
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    console.log(data);
    data["comments"].forEach((com) => {
      let addBox = document.querySelector(".add-comment");
      let you = com.user.username === data["currentUser"]["username"];
      let comApp = new comment(
        com.id,
        com.content,
        com.score,
        com.user,
        com.createdAt,
        you
      );
      addBox.before(comApp.createComment());
      com.replies.forEach((reply) => {
        you = reply.user.username === data["currentUser"]["username"];
        let replApp = new comment(
          reply.id,
          reply.content,
          reply.score,
          reply.user,
          reply.createdAt,
          you
        );
        comApp.replys.append(replApp.createComment());
      });
    });
  });
