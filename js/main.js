import { comment, reply } from "./classes.js";

// retrive data from api and set it to dom
let jsonFile = "data.json";

let app = fetch(jsonFile)
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
        let rplToElement = [
          ...document.querySelectorAll(
            `.container .cont[commentName=${replyApp.replyingTo}]`
          ),
        ];
        let rpl = new reply(
          replyApp.id,
          replyApp.user.username,
          replyApp.score,
          replyApp.content,
          currentUser,
          replyApp.createdAt,
          rplToElement[rplToElement.length - 1].getAttribute("commentId")
        );
        rpl.add();
      }
    }
  });

app.then(() => {
  // increase and decrease rate
  let inAndDeBtn = [...document.querySelectorAll(".cont .rate i")];
  inAndDeBtn.forEach((e) => {
    e.addEventListener("click", (e) => {
      let rateElement = e.currentTarget.parentElement;
      let rateValue = rateElement.children[1];
      if (!e.currentTarget.classList.contains("active")) {
        // if i is increase
        if (e.currentTarget.classList.contains("increase")) {
          rateValue.innerHTML = +rateValue.innerHTML + 1;
        } else {
          rateValue.innerHTML = +rateValue.innerHTML - 1;
        }
        // remove active class from other i
        [...rateElement.children].forEach((e) => {
          e.classList.remove("active");
        });
        // add active class for i that clicked
        e.currentTarget.classList.add("active");
      } else {
        e.currentTarget.classList.remove("active");
        e.currentTarget.classList.contains("increase")
          ? (rateValue.innerHTML = +rateValue.innerHTML - 1)
          : (rateValue.innerHTML = +rateValue.innerHTML + 1);
      }
    });
  });
});
