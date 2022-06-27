class cont {
  constructor(id, name, rate, content, me, date) {
    this.id = id;
    this.name = name;
    this.rate = rate;
    this.content = content;
    this.me = name === me ? true : false;
    this.date = date;
  }
  Create() {
    this.cont = document.createElement("div");
    this.cont.classList.add("cont");
    this.cont.setAttribute("commentId", this.id);
    this.cont.setAttribute("commentName", this.name);
    this.cont.innerHTML = `
            <div class="rate">
              <i class="fa-solid fa-angle-up"></i>
              <div class="rate-value">${this.rate}</div>
              <i class="fa-solid fa-angle-down"></i>
            </div>
            <div class="content">
              <div class="title">
                <div class="left ${this.me === true ? "you" : ""}">
                  <img
                    src="images/avatars/image-${this.name}.webp"
                    class="avatar"
                  />
                  <span class="name">${this.name}</span>
                  <span class="date">${this.date}</span>
                </div>
                <div class="right">
                ${
                  this.me === false
                    ? `
                  <span class="button reply">
                    <img src="images/icon-reply.svg" /> reply
                  </span>
                  `
                    : `
                  <span class="button delete">
                    <img src="images/icon-delete.svg" /> delete
                  </span>
                  <span class="button edit">
                    <img src="images/icon-edit.svg" /> edit
                  </span>`
                }
                </div>
              </div>
              <p>
                ${this.content}
              </p>
            </div>
          `;
  }
}

class comment extends cont {
  static #addCont = document.querySelector(".add");

  add() {
    this.Create();
    comment.#addCont.before(this.cont);
  }
}
comment.constructor = cont.constructor;
class reply extends cont {
  constructor(id, name, rate, content, me, date, replyToId, mention) {
    super(id, name, rate, content, me, date);
    this.replyToId = replyToId;
    this.mention = mention;
  }
  add() {
    this.rplToElement = document.querySelector(
      `.cont[commentId = '${this.replyToId}']`
    );
    this.replys = document.querySelector(
      `.replys[replysToId='${this.replyToId}']`
    );
    // if replys div is existing previous
    if (this.replys) {
      this.replysCont = this.replys.firstElementChild;
    }
    // replys div dosen't exist
    else {
      // if replying is to reply not to comment
      if (this.rplToElement.parentElement.classList.contains("replys-cont")) {
        this.replysCont = this.rplToElement.parentElement;
      }
      // replying is to comment
      else {
        // create replys div set its attributes
        this.replys = document.createElement("div");
        this.replys.classList.add("replys");
        this.replys.setAttribute("replysToId", this.replyToId);
        // create replys-cont div and set its attributes
        this.replysCont = document.createElement("div");
        this.replysCont.classList.add("replys-cont");
        // append replyscont to replys and replys after comment that's replys to it
        this.replys.append(this.replysCont);
        this.rplToElement.after(this.replys);
      }
    }
    // create reply
    this.content = `<a href="#" class="mention">@${this.mention}</a> ${this.content}`;
    this.Create();

    // add reply to replys-cont div
    this.replysCont.append(this.cont);
  }
}

export { comment, reply };
