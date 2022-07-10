class cont {
  constructor(id, name, rate, content, me, date) {
    this.id = id || this.getId();
    this.name = name;
    this.rate = rate;
    this.content = content;
    this.me = name === me ? true : false;
    this.date = date;
  }
  getId() {
    // get last id

    return 23;
  }
  Create() {
    this.cont = document.createElement("div");
    this.cont.classList.add("cont");
    this.cont.setAttribute("commentId", this.id);
    this.cont.setAttribute("commentName", this.name);
    this.cont.innerHTML = `
            <div class="rate">
              <i class="fa-solid fa-angle-up increase"></i>
              <div class="rate-value">${this.rate}</div>
              <i class="fa-solid fa-angle-down decrease"></i>
            </div>
            <div class="content">
              <div class="title ${this.me === true ? "you" : ""}">
                <div class="left">
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
  constructor(id, name, rate, content, me, date, replyToId) {
    super(id, name, rate, content, me, date);
    this.replyToId = replyToId;
  }
  add() {
    this.rplToElement = document.querySelector(
      `.cont[commentId = '${this.replyToId}']`
    );
    this.mention = this.rplToElement.getAttribute("commentName");
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

class commentEvents {
  constructor() {
    this.deleteAndEditButtons();
    this.increaseAndDecreaseRate();
  }
  deleteAndEditButtons() {
    let deleteButton = [...document.querySelectorAll(".cont .button.delete")];
    deleteButton.forEach((e) => {
      e.addEventListener("click", (e) => {
        let cont =
          e.currentTarget.parentElement.parentElement.parentElement
            .parentElement;
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
  }
  increaseAndDecreaseRate() {
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
  }
}
export { comment, reply, commentEvents };
