import { comment, reply, commentEvents } from "./classes.js";

//////////////////////////////////////////////////
//////////////// incomplete tasks ////////////////
// there is bug in edit button in new reply //////
// there is bug in increase and decrease buttons /

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
    return data;
  });

// add my photo to comment box
app.then((app) => {
  // set comment
  let myPhoto = document.querySelector(".add.send .logo");
  myPhoto.src = app.currentUser.image.png;
  return app.currentUser;
});

// make comment events
app.then(() => {
  new commentEvents();
});

// make edit and reply button code
app.then((currentUser) => {
  let buttons = [...document.querySelectorAll(".cont .button:not(.delete)")];
  buttons.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("edit")) {
        /////////////////////////// edit button
        let textArea =
          e.currentTarget.parentElement.parentElement.nextElementSibling;
        // to sure not to make more than one update button
        if (textArea.contentEditable === "inherit") {
          // create update box
          let pContent = textArea.innerHTML;
          textArea.setAttribute("contentEditable", "true");
          textArea.focus();
          let updateButton = document.createElement("a");
          updateButton.href = "#";
          updateButton.className = "update-btn";
          updateButton.innerText = "update";
          textArea.after(updateButton);
          textArea.onblur = () => {
            textArea.focus();
          };
          // remove on blur
          textArea.parentElement.parentElement.addEventListener(
            "click",
            (e) => {
              e.stopPropagation();
            }
          );
          document.addEventListener("click", (e) => {
            if (e.currentTarget != textArea.parentElement.parentElement) {
              textArea.removeAttribute("contentEditable");
              textArea.innerHTML = pContent;
              updateButton.remove();
            }
          });
          // get updated element
          updateButton.addEventListener("click", (e) => {
            textArea.removeAttribute("contentEditable");
            updateButton.remove();
            // make mention
          });
        }
      } else {
        ////////////////////////// reply button
        let cont =
          e.currentTarget.parentElement.parentElement.parentElement
            .parentElement;
        // to sure not to make more than one rplbox
        if (
          document.querySelector(".add:not(.send)") !== cont.nextElementSibling
        ) {
          // create rpl box
          let rplBox = document.querySelector(".add.send").cloneNode(true);
          rplBox.lastElementChild.innerText = "reply";
          cont.after(rplBox);
          rplBox.classList.remove("send");
          rplBox.children[1].focus();

          // remove on blur
          rplBox.addEventListener("click", (e) => e.stopPropagation());
          document.addEventListener("click", (el) => {
            if (
              el.currentTarget != rplBox &&
              el.currentTarget != e.currentTarget
            ) {
              rplBox.remove();
            }
          });
          // get send button
          let replyButton = rplBox.children[2];
          // get textArea
          let textArea = rplBox.children[1];
          // on reply button click
          replyButton.addEventListener("click", (e) => {
            // remove rplBox
            rplBox.remove();
            // set new reply
            let rplCont = new reply(
              null,
              currentUser.currentUser.username,
              0,
              textArea.value,
              currentUser.currentUser.username,
              "now",
              cont.getAttribute("commentid")
            );
            rplCont.add();
            // make buttons events work in new replys
            new commentEvents();
          });
        }
      }
    });
  });
});
