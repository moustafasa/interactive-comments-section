import { comment, events } from "./classes.js";
let addBox = document.querySelector(".add-comment");
fetch("data.json")
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    // store current user
    window.sessionStorage.setItem("username", data["currentUser"]["username"]);
    window.sessionStorage.setItem(
      "userimage",
      JSON.stringify(data["currentUser"]["image"])
    );
    // store last id
    addBox.querySelector("img").src = data["currentUser"]["image"]["png"];
    // show comments and replys from api
    data["comments"].forEach((com) => {
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
        console.log(reply);
        you = reply.user.username === data["currentUser"]["username"];
        let replApp = new comment(
          reply.id,
          reply.content,
          reply.score,
          reply.user,
          reply.createdAt,
          you,
          reply.replyingTo
        );
        comApp.replys.append(replApp.createComment());
      });
    });
  });

// add reply by add box
addBox.querySelector("button").addEventListener("click", (ev) => {
  let evt = new events(ev);
  evt.add();
});
