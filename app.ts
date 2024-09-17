

const BASE_URL: string = "https://jsonplaceholder.typicode.com/";
const select: HTMLSelectElement = document.querySelector("select")!;//הסימן קריאה בסוף אומר שאני יודע שיש סלקט בדף
const todosDiv: HTMLDivElement = document.querySelector(".todos")!;
const selectDid: HTMLDivElement = document.querySelector(".selectDiv")!;
const btnGetUsersToDo: HTMLButtonElement = document.querySelector("#btnGetUsersToDo")!;
const btnGetUsersPost: HTMLButtonElement = document.querySelector("#btnGetUsersPost")!;
const reset: HTMLButtonElement = document.querySelector("#reset")!;
const all: HTMLDivElement = document.querySelector(".all")!;
const center: HTMLDivElement = document.querySelector(".center")!;
const btnCreateUsersPost :HTMLButtonElement = document.querySelector("#btnCreateUsersPost")!;

reset.addEventListener("click", () => {
    window.location.reload();
})

const fillingSelectUser = async (): Promise<void> => {
    try {
        const res: Response = await fetch(BASE_URL + "users");
        const users:User[] = await res.json();
        console.log(users);
        for(const user of users){
            const option:HTMLOptionElement = document.createElement("option");
            option.value = user.id.toString();
            option.innerHTML = `${user.name}: (${user.username})`;
            select.appendChild(option);
        }
    } catch (err) {
        console.log(err);
    }
};
fillingSelectUser();

btnGetUsersToDo.addEventListener("click", (e) => {
    const optionValue: string = select.value;
    if(optionValue == ""){
        alert("you dont choose any user");
    }else{
        getToDoByUser(e as MouseEvent);
    }
})


const getToDoByUser = async (e:MouseEvent): Promise<void>  => {
    try{
        const res = await fetch(`${BASE_URL}todos?userId=${select.value}`);
        const todo:ToDo[] = await res.json();
        todosDiv.textContent = "";
        for(const t of todo){
            const cardDiv:HTMLDivElement = document.createElement("div");
            cardDiv.className = "card";
            const title : HTMLHeadingElement = document.createElement("h4");
            title.textContent = t.title;
            const titleDiv : HTMLDivElement = document.createElement("div");
            titleDiv.appendChild(title);
            const completed: HTMLHeadingElement = document.createElement("h5");
            const completedDiv : HTMLDivElement = document.createElement("div");
            completedDiv.appendChild(completed);
            completed.textContent = `${t.completed}`;
            cardDiv.append(titleDiv, completedDiv);
            todosDiv.appendChild(cardDiv);
        };
    }catch (err){
        console.log(err);
    }
};


const getPostByUser = async (e:MouseEvent): Promise<void>  => {
    try{
        const res:Response = await fetch(`${BASE_URL}posts?userId=${select.value}`);
        const post:Post[] = await res.json();
        console.log(post);
        todosDiv.textContent = "";
        for(const p of post){
            const cardDiv:HTMLDivElement = document.createElement("div");
            cardDiv.className = "card";
            const title:HTMLHeadingElement = document.createElement("h4");
            title.textContent = p.title;
            const titleDiv:HTMLDivElement = document.createElement("div");
            titleDiv.appendChild(title);
            const body:HTMLHeadingElement = document.createElement("h5");
            const bodyDiv:HTMLDivElement = document.createElement("div");
            bodyDiv.appendChild(body);
            body.textContent = `${p.body}`;
            const divAllText:HTMLDivElement = document.createElement("div");
            divAllText.className = "divAllText";
            divAllText.append(titleDiv, bodyDiv);
            const btnUpdatePost:HTMLButtonElement = document.createElement("button");
            const btnsDiv:HTMLDivElement = document.createElement("div");
            btnsDiv.className = "classicButton btnUpdatePost";
            btnUpdatePost.textContent = "Update Post";
            btnUpdatePost.addEventListener("click", async () => {
                const newTitle = window.prompt(`enter new title`);
                const newBody = window.prompt(`enter new body`);
                try{
                    const res:Response = await fetch(`${BASE_URL}posts/${p.id}`, {
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
                    const post = await res.json();
                    console.log(`post= `, post);
                }catch (err){
                    console.log("err= ", err);
                }
            });
            const btnGetAllComments:HTMLButtonElement = document.createElement("button");
            btnGetAllComments.textContent = "Get All Comments";
            btnGetAllComments.className = "classicButton";
            btnGetAllComments.addEventListener("click", async () => {
                alert("not implemented yet (btnGetAllComments)");
            });
            const btnDeletePost:HTMLButtonElement = document.createElement("button");
            btnDeletePost.textContent = "Delete Post";
            btnDeletePost.className = "classicButton";
            btnDeletePost.addEventListener("click", async () => {
                try{
                    const res:Response = await fetch(`${BASE_URL}posts/${p.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    });
                    const post:Post = await res.json();
                    console.log(`post= `, post);
                }catch (err){
                    console.log(err);
                };
            });
            btnsDiv.append(btnUpdatePost, btnGetAllComments, btnDeletePost);
            cardDiv.append(divAllText, btnsDiv);
            todosDiv.appendChild(cardDiv);
        }
    }catch (err){
        console.log(err);

    };
};

btnGetUsersPost.addEventListener("click", (e) => {
    const optionValue: string = select.value;
    if(optionValue == ""){
        alert("you dont choose any user");
    }else{
        getPostByUser(e as MouseEvent);
    }
})


btnCreateUsersPost.addEventListener("click", async (e) => {
    if(select.value == ""){
        alert("please choose a user");
        return;
    }
    const titlePost = window.prompt(`enter title`);
    const bodyPost = window.prompt(`enter body`);
    if(titlePost == "" || bodyPost == ""){
        alert("please enter title and body");
        return;
    }
    else{
        try{
            const res:Response = await fetch(`${BASE_URL}posts`, {
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
            const post = await res.json();
            console.log(`post= `, post);
        }catch (err){
            console.log("err= ", err);
        }
    }

})




interface ToDo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

interface User {
    id: number
    name: string
    username: string
    email: string
    address: {
        street: string
        suite: string
        city: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone:string
};

class User implements User {
public constructor(id: number, name: string, username: string, email: string, address: { street: string, suite: string, city: string, zipcode: string, geo: { lat: string, lng: string } }, phone: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
};
};

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

