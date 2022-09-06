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
    this.content = content;
    this.score = score;
    this.user = user;
    this.date = date;
    this.replyTo = replyTo;
    this.you = you;
  }
  createComment() {
    this.box = document.createElement("div");
    this.box.classList.add("box");
    this.box.id = this.id;
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
      // create edit btn and delete btn if you
      this.btn.classList.add("delete-btn");
      this.btn.innerHTML = `
        <img src="./images/icon-delete.svg">
        delete
      `;
      this.otherBtn = document.createElement("a");
      this.otherBtn.href = "#";
      this.otherBtn.classList.add("edit-btn");
      this.otherBtn.innerHTML = `        
        <img src="./images/icon-edit.svg">
        edit
        `;
      this.btns.append(this.otherBtn);
    } else {
      // create reply btn if not you
      this.btn.classList.add("reply-btn");
      this.btn.innerHTML = `
        <img src="./images/icon-reply.svg">
        reply
      `;
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

// class comment extends createComment {
//   constructor(id, content, score, user, date, parent, you, replyTo) {
//     super(id, content, score, user, date, parent, you, replyTo);
//   }
// }

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
