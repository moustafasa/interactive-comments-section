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
      if (!dels(com.id)) {
        let comApp = createComm(com);
        addBox.before(comApp.createComment());
        com.replies.forEach((reply) => {
          if (!dels(reply.id)) {
            let replyApp = createComm(reply);
            comApp.replys.append(replyApp.createComment());
          }
        });
      }
    });
  })
  .then(() => {
    // get comments added from localStorage
    let newComments = localStorage["new"];
    if (newComments) {
      JSON.parse(newComments).forEach((com) => {
        // check if it deleted or not
        if (!dels(com.id)) {
          let comApp = createComm(com);
          // check if it reply or comment
          if (comApp.replyTo) {
            // if it reply not comment
            let box = document.querySelector(
              `.box[data-name='${comApp.replyTo}']`
            );
            // check if it reply to another reply or to comment
            if (box.closest(".replys")) {
              // if it reply to another reply
              box.closest(".replys").append(comApp.createComment());
            } else {
              // if it reply to comment
              box
                .closest(".comment")
                .querySelector(".replys")
                .append(comApp.createComment());
            }
          } else {
            // if it comment not reply
            document
              .querySelector(".add-comment")
              .before(comApp.createComment());
          }
        } else {
          // if deleted
          let newLocal = JSON.parse(localStorage["new"]);
          // delete element from new in localstorage
          newLocal.splice(newLocal.indexOf(com), 1);
          localStorage["new"] = JSON.stringify(newLocal);
          // delete its id from dels in localstorage
          localStorage["dels"] = localStorage["dels"]
            .split(",")
            .filter((ele) => ele != com.id)
            .join(",");
        }
      });
    }
  });

// add reply by add box
addBox.querySelector("button").addEventListener("click", (ev) => {
  let evt = new events(ev);
  evt.add();
});

function createComm(com) {
  let you = com.user.username === sessionStorage["username"];
  let comApp = new comment(
    com.id,
    com.content,
    com.score,
    com.user,
    com.createdAt,
    you,
    com.replyingTo
  );
  return comApp;
}

function dels(id) {
  if (localStorage["dels"]) {
    if (
      localStorage["dels"]
        .split(",")
        .map((v) => +v)
        .includes(id)
    ) {
      return true;
    }
  }
  return false;
}
