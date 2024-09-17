"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://jsonplaceholder.typicode.com/";
const select = document.querySelector("select"); //הסימן קריאה בסוף אומר שאני יודע שיש סלקט בדף
const todosDiv = document.querySelector(".todos");
const selectDid = document.querySelector(".selectDiv");
const btnGetUsersToDo = document.querySelector("#btnGetUsersToDo");
const btnGetUsersPost = document.querySelector("#btnGetUsersPost");
const reset = document.querySelector("#reset");
const all = document.querySelector(".all");
const center = document.querySelector(".center");
const btnCreateUsersPost = document.querySelector("#btnCreateUsersPost");
reset.addEventListener("click", () => {
    window.location.reload();
});
const fillingSelectUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(BASE_URL + "users");
        const users = yield res.json();
        console.log(users);
        for (const user of users) {
            const option = document.createElement("option");
            option.value = user.id.toString();
            option.innerHTML = `${user.name}: (${user.username})`;
            select.appendChild(option);
        }
    }
    catch (err) {
        console.log(err);
    }
});
fillingSelectUser();
btnGetUsersToDo.addEventListener("click", (e) => {
    const optionValue = select.value;
    if (optionValue == "") {
        alert("you dont choose any user");
    }
    else {
        getToDoByUser(e);
    }
});
const getToDoByUser = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE_URL}todos?userId=${select.value}`);
        const todo = yield res.json();
        todosDiv.textContent = "";
        for (const t of todo) {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            const title = document.createElement("h4");
            title.textContent = t.title;
            const titleDiv = document.createElement("div");
            titleDiv.appendChild(title);
            const completed = document.createElement("h5");
            const completedDiv = document.createElement("div");
            completedDiv.appendChild(completed);
            completed.textContent = `${t.completed}`;
            cardDiv.append(titleDiv, completedDiv);
            todosDiv.appendChild(cardDiv);
        }
        ;
    }
    catch (err) {
        console.log(err);
    }
});
const getPostByUser = (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE_URL}posts?userId=${select.value}`);
        const post = yield res.json();
        console.log(post);
        todosDiv.textContent = "";
        for (const p of post) {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
            const title = document.createElement("h4");
            title.textContent = p.title;
            const titleDiv = document.createElement("div");
            titleDiv.appendChild(title);
            const body = document.createElement("h5");
            const bodyDiv = document.createElement("div");
            bodyDiv.appendChild(body);
            body.textContent = `${p.body}`;
            const divAllText = document.createElement("div");
            divAllText.className = "divAllText";
            divAllText.append(titleDiv, bodyDiv);
            const btnUpdatePost = document.createElement("button");
            const btnsDiv = document.createElement("div");
            btnsDiv.className = "classicButton btnUpdatePost";
            btnUpdatePost.textContent = "Update Post";
            btnUpdatePost.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                const newTitle = window.prompt(`enter new title`);
                const newBody = window.prompt(`enter new body`);
                try {
                    const res = yield fetch(`${BASE_URL}posts/${p.id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            title: newTitle,
                            body: newBody,
                            userId: p.userId,
                            id: p.id
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    });
                    const post = yield res.json();
                    console.log(`post= `, post);
                }
                catch (err) {
                    console.log("err= ", err);
                }
            }));
            const btnGetAllComments = document.createElement("button");
            btnGetAllComments.textContent = "Get All Comments";
            btnGetAllComments.className = "classicButton";
            btnGetAllComments.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                alert("not implemented yet (btnGetAllComments)");
            }));
            const btnDeletePost = document.createElement("button");
            btnDeletePost.textContent = "Delete Post";
            btnDeletePost.className = "classicButton";
            btnDeletePost.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const res = yield fetch(`${BASE_URL}posts/${p.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    });
                    const post = yield res.json();
                    console.log(`post= `, post);
                }
                catch (err) {
                    console.log(err);
                }
                ;
            }));
            btnsDiv.append(btnUpdatePost, btnGetAllComments, btnDeletePost);
            cardDiv.append(divAllText, btnsDiv);
            todosDiv.appendChild(cardDiv);
        }
    }
    catch (err) {
        console.log(err);
    }
    ;
});
btnGetUsersPost.addEventListener("click", (e) => {
    const optionValue = select.value;
    if (optionValue == "") {
        alert("you dont choose any user");
    }
    else {
        getPostByUser(e);
    }
});
btnCreateUsersPost.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (select.value == "") {
        alert("please choose a user");
        return;
    }
    const titlePost = window.prompt(`enter title`);
    const bodyPost = window.prompt(`enter body`);
    if (titlePost == "" || bodyPost == "") {
        alert("please enter title and body");
        return;
    }
    else {
        try {
            const res = yield fetch(`${BASE_URL}posts`, {
                method: "POST",
                body: JSON.stringify({
                    title: titlePost,
                    body: bodyPost,
                    userId: select.value
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const post = yield res.json();
            console.log(`post= `, post);
        }
        catch (err) {
            console.log("err= ", err);
        }
    }
}));
;
;
class User {
    constructor(id, name, username, email, address, phone) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.address = address;
        this.phone = phone;
    }
    ;
}
;
