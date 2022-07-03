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
    return data;
  });

// add my photo to comment box
app.then((app) => {
  // set comment
  let myPhoto = document.querySelector(".add.send .logo");
  myPhoto.src = app.currentUser.image.png;
});

// make edit and reply button code
app.then(() => {
  let buttons = [...document.querySelectorAll(".cont .button:not(.delete)")];
  buttons.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("edit")) {
        console.log(e.currentTarget.contentEditable);
        /////////////////////////// edit button
        let textArea =
          e.currentTarget.parentElement.parentElement.nextElementSibling;
        // to sure not to make more than one update button
        if (textArea.contentEditable === "inherit") {
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
          let rplBox = document.querySelector(".add.send").cloneNode(true);
          rplBox.lastElementChild.innerText = "reply";
          cont.after(rplBox);
          rplBox.addEventListener("click", (e) => e.stopPropagation());
          rplBox.classList.remove("send");
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
          // set new reply
          replyButton.addEventListener("click", () => {});
        }
      }
    });
  });
});

// make delete button code
app.then(() => {
  let deleteButton = [...document.querySelectorAll(".cont .button.delete")];
  deleteButton.forEach((e) => {
    e.addEventListener("click", (e) => {
      let cont =
        e.currentTarget.parentElement.parentElement.parentElement.parentElement;
      // pop up confirmation dialoge
      let dialoge = document.createElement("div");
      dialoge.className = "confirmation";
      dialoge.innerHTML = `
        <h2 class='delete-head'>Delete comment</h2>
        <p class='delete-conf-ques'>
          Are you sure you want to delete this comment?
          This will remove the comment and can't be undone.
        </p>
        <div class='buttons'>
          <a href='#' class='no'>no, cancel</a>
          <a href='#' class='yes'>yes, delete</a>
        </div>
      `;
      let overlay = document.createElement("div");
      overlay.className = "overlay";
      document.body.append(dialoge);
      document.body.append(overlay);
      // get confirmation value
      let buttons = [...document.querySelectorAll(".confirmation a")];
      buttons.forEach((a) => {
        a.addEventListener("click", (e) => {
          dialoge.remove();
          overlay.remove();
          if (e.currentTarget.classList.contains("yes")) {
            cont.remove();
          }
        });
      });
    });
  });
});

// increase and decrease rate
app.then(() => {
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
