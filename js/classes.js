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
    this.span = document.createElement("span");
    this.span.innerText = this.score;
    this.decrease = document.createElement("a");
    this.decrease.classList.add("decrease");
    this.decrease.innerHTML = '<i class="fa-solid fa-minus"></i>';
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
      this.ev = ev;
      this.add();
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
  edit() {
    // make button unactive
    this.editBtn = this.ev.currentTarget;
    this.editBtn.classList.add("active");
    this.box = this.ev.currentTarget.closest(".box");
    this.commentBody = this.box.querySelector(".comment-body");
    this.pContent = this.box.querySelector("p.content");
    // make textarea to replace pcontent by it
    this.textarea = document.createElement("textarea");
    this.textarea.classList.add("content");
    this.textarea.cols = "30";
    this.textarea.rows = "3";
    this.textarea.value = this.pContent.innerText;
    this.commentBody.replaceChild(this.textarea, this.pContent);
    this.textarea.focus();

    // make update button
    this.button = document.createElement("button");
    this.button.classList.add("send");
    this.button.innerText = "update";

    this.commentBody.append(this.button);
    document.addEventListener("click", (ev) => {
      if (!ev.target.closest(`.box[id='${this.box.id}']`)) {
        this.#resetEdit();
      }
    });
    this.button.addEventListener("click", (ev) => {
      this.ev = ev;
      this.update();
    });
  }
  update() {}
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
  #resetEdit() {
    this.editBtn.classList.remove("active");
    this.button.remove();
    console.log(this.commentBody.querySelector("textarea"));
    if (this.commentBody.querySelector("textarea")) {
      this.commentBody.replaceChild(this.pContent, this.textarea);
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
