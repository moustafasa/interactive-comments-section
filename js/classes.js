export class comment {
  id;
  content;
  score;
  user;
  date;
  type;
  you;
  replyTo;

  constructor(id, content, score, user, date, you, replyTo = null) {
    this.id = id;
    if (!this.id) {
      this.#getId();
    }
    this.content = content;
    this.score = score;
    this.user = user;
    this.date = date;
    this.replyTo = replyTo;
    this.you = you;
  }
  #getId() {
    this.id =
      Math.max(
        ...[...document.querySelectorAll(".box")].map((ele) => +ele.id)
      ) + 1;
    console.log(this.id);
  }
  createComment() {
    this.box = document.createElement("div");
    this.box.classList.add("box");
    this.box.id = this.id;
    this.box.dataset.name = this.user.username;
    if (this.you) {
      this.box.classList.add("you");
    }

    this.box.append(
      this.#createBtns(),
      this.#createCommentBody(),
      this.#createRate()
    );

    if (!this.replyTo) {
      this.comment = document.createElement("div");
      this.comment.classList.add("comment");
      this.replys = document.createElement("div");
      this.replys.classList.add("replys");
      this.comment.append(this.box, this.replys);
      return this.comment;
    } else {
      return this.box;
    }
  }
  #createBtns() {
    this.btns = document.createElement("div");
    this.btns.classList.add("btns");
    // create btn
    this.btn = document.createElement("a");
    this.btn.setAttribute("href", "#");
    this.btns.append(this.btn);
    if (this.you) {
      // create delete btn
      this.btn.classList.add("delete-btn");
      this.btn.innerHTML = `
        <img src="./images/icon-delete.svg">
        delete
      `;
      this.btn.addEventListener("click", (ev) => {
        this.event2 = new events(ev);
        this.event2.delete();
      });
      // create edit button
      this.otherBtn = document.createElement("a");
      this.otherBtn.href = "#";
      this.otherBtn.classList.add("edit-btn");
      this.otherBtn.innerHTML = `        
        <img src="./images/icon-edit.svg">
        edit
        `;
      this.otherBtn.addEventListener("click", (ev) => {
        this.event = new events(ev);
        this.event.edit();
      });
      this.btns.append(this.otherBtn);
    } else {
      // create reply btn if not you
      this.btn.classList.add("reply-btn");
      this.btn.innerHTML = `
        <img src="./images/icon-reply.svg">
        reply
      `;
      this.btn.addEventListener("click", (ev) => {
        this.event = new events(ev);
        this.event.reply();
      });
    }
    return this.btns;
  }
  #createCommentBody() {
    this.commentBody = document.createElement("div");
    this.commentBody.classList.add("comment-body");
    this.info = document.createElement("div");
    this.info.classList.add("info");
    this.info.innerHTML = `
      <div class="img">
        <img src="${this.user.image.png}">
        <h2 class="name">${this.user.username}</h2>
      </div>
      <div class="time">${this.date}</div>
    `;
    this.contentP = document.createElement("p");
    this.contentP.classList.add("content");
    this.contentP.dataset.replyTo = this.replyTo;
    this.contentP.innerHTML = `${
      this.replyTo
        ? '<a href="#" class="mention">@' + this.replyTo + "</a> "
        : ""
    }
      ${this.content}
    `;
    this.commentBody.append(this.info, this.contentP);
    return this.commentBody;
  }
  #createRate() {
    this.rate = document.createElement("div");
    this.rate.classList.add("rate");
    this.increase = document.createElement("a");
    this.increase.classList.add("increase");
    this.increase.innerHTML = '<i class="fa-solid fa-plus"></i>';
    this.increase.addEventListener("click", (ev) => {
      this.rateEvent = new events(ev);
      this.rateEvent.rate(1);
    });
    this.span = document.createElement("span");
    this.span.innerText = this.score;
    this.decrease = document.createElement("a");
    this.decrease.classList.add("decrease");
    this.decrease.innerHTML = '<i class="fa-solid fa-minus"></i>';
    this.decrease.addEventListener("click", (ev) => {
      this.rateEvent = new events(ev);
      this.rateEvent.rate(-1);
    });
    this.rate.append(this.increase, this.span, this.decrease);
    return this.rate;
  }
}

export class events {
  constructor(ev) {
    this.ev = ev;
    this.ev.preventDefault();
  }
  reply() {
    // get comment that will reply to
    this.parent = this.ev.currentTarget.closest(".box");
    this.oldReplyBox = document.querySelector(".add-reply");
    // remove add boxes if there are another
    if (this.oldReplyBox) {
      this.oldReplyBox.remove();
      if (this.oldReplyBox.dataset.replyTo === this.parent.dataset.name) {
        return;
      }
    }
    // get add box
    this.addBox = document.querySelector(".add-comment");
    // clone add box to make replybox
    this.replyBox = this.addBox.cloneNode(true);
    this.replyBox.classList.remove("add-comment");
    this.replyBox.classList.add("add-reply");
    this.replyBox.dataset.replyTo = this.parent.dataset.name;
    // get textarea
    this.textarea = this.replyBox.querySelector("textarea");
    // set textarea value as @replyto
    this.textarea.value = `@${this.parent.dataset.name} `;
    // get button and make it text = reply
    this.button = this.replyBox.querySelector("button");
    this.button.innerText = "reply";
    this.replys = this.parent.closest(".replys");
    this.parent.after(this.replyBox);
    this.textarea.focus();
    // remove reply box on click
    document.addEventListener("click", (ev) => {
      if (
        !ev.target.closest(".add-reply") &&
        !ev.target.closest(`div[id='${this.parent.id}']`)
      ) {
        this.replyBox.remove();
      }
    });
    // set event of button
    this.button.addEventListener("click", (ev) => {
      this.event = new events(ev);
      this.event.add();
    });
    /*
      1- get add box 
      2- clone it 
      3- change button name
      4- make taskarea value ='';
      5- get comment that has reply button by (closest)
      6- get reply to name
      7- set textarea value = '@replytoname '
    */
  }
  add() {
    this.addBox = this.ev.currentTarget.closest(".add-box");
    this.textarea = this.addBox.querySelector("textarea");
    this.valid = true;
    this.replyTo = this.addBox.dataset.replyTo;
    this.content = this.textarea.value;
    // if we need when delete mention from textarea not to add it
    // in comment
    // this.replyToValue = null;
    this.#validateTextarea();
    if (this.valid) {
      this.user = {
        username: window.sessionStorage.getItem("username"),
        image: JSON.parse(window.sessionStorage.getItem("userimage")),
      };
      // create comment
      this.comApp = new comment(
        undefined,
        this.content,
        0,
        this.user,
        "now",
        true,
        this.replyTo
      );
      this.box = this.comApp.createComment();
      // append comment box
      if (this.replyTo) {
        this.replys =
          this.addBox.closest(".replys") ||
          this.addBox.closest(".comment").querySelector(".replys");
        this.replys.append(this.box);
        this.addBox.remove();
      } else {
        this.addBox.before(this.box);
        this.textarea.value = "";
      }
      this.box.scrollIntoView();
    }
  }
  #validateTextarea() {
    if (this.textarea.value.trim() === "") {
      this.valid = false;
      return;
    } else if (this.replyTo) {
      if (this.textarea.value.match(/@\w+/) !== null) {
        // check if @name is not typed by user and is refer to replyto
        if (this.textarea.value.match(/@\w+/)[0] === "@" + this.replyTo) {
          if (this.textarea.value.replace(/@\w+/, "").trim() === "") {
            this.valid = false;
            return;
          }
          this.content = this.textarea.value.replace(/@\w+/, "");
          // if we need when delete mention from textarea not to add it
          // in comment
          // this.replyToValue = this.replyTo;
        }
      }
    }
  }
  edit() {
    this.ev.currentTarget.classList.add("disabled");
    this.box = this.ev.currentTarget.closest(".box");
    this.box.classList.add("editable");
    this.pContent = this.box.querySelector("p.content");
    this.commentBody = this.box.querySelector(".comment-body");
    // set textarea
    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("content");
    this.textarea.value = this.pContent.innerText;
    this.textarea.rows = 4;
    this.pContent.replaceWith(this.textarea);
    this.textarea.focus();
    this.content = this.pContent.innerText.replace(/\s+/g, " ").trim();

    // set update button
    this.button = document.createElement("button");
    this.button.classList.add("send", "disabled");
    this.button.innerText = "update";
    this.commentBody.append(this.button);
    this.button.addEventListener("click", (ev) => {
      this.event = new events(ev);
      this.event.pContent = this.pContent;
      document.removeEventListener("click", this.removeOnBlur);
      this.event.update();
    });

    // make button in disabled if no change
    this.textarea.addEventListener("input", () => {
      if (this.#ifChange()) {
        this.button.classList.remove("disabled");
      } else {
        this.button.classList.add("disabled");
      }
    });

    this.removeOnBlur = (ev) => {
      if (
        !ev.target.closest(`.box.editable[id='${this.box.id}']`) &&
        !ev.target.closest(".confirm-window")
      ) {
        if (this.#ifChange()) {
          if (!document.querySelector(".confirm-window")) {
            this.OnAccept = () => {
              this.#resetEdit();
              document.removeEventListener("click", this.removeOnBlur);
            };
            this.#confirm(
              "you sure you need to ignore msgs",
              "ignore changes",
              "yes",
              "no"
            );
          }
        } else {
          this.#resetEdit();
          document.removeEventListener("click", this.removeOnBlur);
        }
      }
    };
    // check if changed or not
    document.addEventListener("click", this.removeOnBlur);
  }
  update() {
    this.button = this.ev.currentTarget;
    this.box = this.button.closest(".box");
    this.textarea = this.box.querySelector("textarea");
    this.replyTo = null;
    this.content = this.textarea.value.trim();
    if (/@\w+/.test(this.content) && this.pContent.dataset.replyTo) {
      if (
        this.content.match(/@\w+/).join().replace("@", "") ===
        this.pContent.dataset.replyTo
      ) {
        this.content = this.content.replace(/@\w+/, "");
        this.replyTo = this.pContent.dataset.replyTo;
      }
    }
    this.pContent.innerHTML = `${
      this.replyTo ? `<a href="#" class="mention">@${this.replyTo}</a>` : ""
    } ${this.content}
    `;
    this.#resetEdit();
  }

  #resetEdit() {
    this.box.querySelector(".edit-btn").classList.remove("disabled");
    this.textarea.replaceWith(this.pContent);
    this.button.remove();
    this.box.classList.remove("editable");
    this.textarea.remove();
  }
  delete() {
    this.deleteBtn = this.ev.currentTarget;
    this.OnAccept = () => {
      if (this.deleteBtn.closest(".replys")) {
        this.deleteBtn.closest(".box").remove();
      } else {
        this.deleteBtn.closest(".comment").remove();
      }
    };
    this.#confirm(
      "are you sure you want to delete this comment? this will remove the comment and can't be undone",
      "delete comment",
      "yes, delete",
      "no, cancel"
    );
  }
  #confirm(confMsg, title, acceptBtn, cancelBtn) {
    // set overlay window
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");

    // set confirm window
    this.confirmDiv = document.createElement("div");
    this.confirmDiv.classList.add("confirm-window");
    // set title
    this.title = document.createElement("h2");
    this.title.classList.add("conf-title");
    this.title.innerText = title;
    // set confmsg
    this.confMsg = document.createElement("p");
    this.confMsg.classList.add("confirm-msg");
    this.confMsg.innerText = confMsg;
    // set button cont
    this.btnCont = document.createElement("div");
    this.btnCont.classList.add("btn-cont");
    // append all
    this.confirmDiv.append(this.title, this.confMsg, this.btnCont);

    // set cancel btn
    if (cancelBtn) {
      this.cancelBtn = document.createElement("button");
      this.cancelBtn.classList.add("cancel");
      this.cancelBtn.innerText = cancelBtn;
      this.cancelBtn.addEventListener("click", (ev) =>
        ev.currentTarget.closest(".overlay").remove()
      );
      this.btnCont.append(this.cancelBtn);
    }
    // set accept btn
    if (acceptBtn) {
      this.acceptBtn = document.createElement("button");
      this.acceptBtn.classList.add("accept");
      this.acceptBtn.innerText = acceptBtn;
      this.acceptBtn.addEventListener("click", (eve) => {
        this.overlay.remove();
        this.OnAccept();
      });
      this.btnCont.append(this.acceptBtn);
    }
    if ((acceptBtn || cancelBtn) && !(acceptBtn && cancelBtn)) {
      this.confirmDiv.classList.add("warning");
    }
    this.overlay.append(this.confirmDiv);
    document.body.append(this.overlay);
  }
  #ifChange() {
    if (this.textarea.value.trim() !== this.content) {
      if (this.textarea.value.trim() !== "") {
        if (/@\w+/.test(this.textarea.value) && /@\w+/.test(this.content)) {
          if (this.textarea.value.trim() !== this.content.match(/@\w+/)[0]) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  }
  rate(bonus) {
    this.btn = this.ev.currentTarget;
    this.rateElement = this.btn.closest(".rate");
    this.box = this.btn.closest(".box");
    this.span = this.rateElement.querySelector("span");
    if (!this.box.classList.contains("you")) {
      if (!this.box.classList.contains("rated")) {
        // not rated
        this.box.classList.add("rated");
        this.btn.classList.add("active");
        this.span.innerText = +this.span.innerText + bonus;
      } else {
        // rated

        if (this.btn.classList.contains("active")) {
          this.title = "undo rating comment";
          this.msg = "do you need to undo rating this comment?";
          this.OnAccept = () => {
            this.btn.classList.remove("active");
            this.box.classList.remove("rated");
            this.span.innerText = +this.span.innerText - bonus;
          };
        } else {
          this.title = "change rate of the comment";
          this.msg = "do you need to change the rate of this comment?";
          this.OnAccept = () => {
            this.rateElement
              .querySelector(".active")
              .classList.remove("active");
            this.box.classList.remove("rated");
            this.span.innerText = +this.span.innerText + bonus;
            this.btn.click();
          };
        }
        this.#confirm(this.msg, this.title, "yes", "no");
      }
    } else {
      this.#confirm(
        "sorry, you can't rate your comment",
        "warrning",
        null,
        "ok"
      );
    }
  }
}

/*
1- show data
  1-create comment div
  2-create box div
    1-btns div
      1-a.reply-btn or update or delete
        1-img 
        2-text(reply or update or delete)
    2-comment-body div
      1-info div
        1-img div
          1-img 
          2-h2.name
        2-time div
      2-content div
        if reply
          1-a.mention
    3-rate div
      1-a.increase
      2-span
      3-a.decrease
  if comment
    3-create replys div






*/
