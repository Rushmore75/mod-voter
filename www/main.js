
loadList()

async function loadList() {
    console.log("loading list");
    try {       
        // get the current list from the backend
        fetch(document.location.origin + "/api/getlist")
            .then(res => {
                const html_list = document.getElementById("list");
                res.json().then(json => {
                    for (const i in json) {
                        // the div
                        const element = document.createElement("div");
                        element.className = "list-item";
                        // paragraph
                        const content = document.createElement("p");
                        content.innerText = 
                            json[i].name
                            +"\n"
                            + json[i].link;
                        // vote
                        const up_vote =
                            `<button type="button" class="vote" onclick="upvote(${i})">up</button>`;
                        const down_vote =
                            `<button type="button" class="vote" onclick="downvote(${i})">down</button>`;
                        
                        const up_count = document.createElement("p");
                            up_count.className = "up-count";
                            up_count.id = "up-count-"+i;

                        const down_count = document.createElement("p");
                            down_count.className = "down-count";
                            down_count.id = "down-count-"+i;
                        getItem(i).then(e => {
                            e.json().then(j => {
                                up_count.innerText = j.votes_up;
                                down_count.innerText = j.votes_down;
                            })
                        });
                        // add
                        element.appendChild(up_count);
                        element.appendChild(content);
                        element.appendChild(down_count);
                        element.insertAdjacentHTML("afterbegin", up_vote);
                        element.insertAdjacentHTML("beforeend", down_vote);
                        html_list.appendChild(element);
                    }
                });
            })
        } catch (e) {
        console.log("api fail" + e);
    }

}

// deno-lint-ignore no-unused-vars
function downvote(index) {
    // TODO only allow one vote per mod
    fetch(document.location.origin + "/api/downvote/" + index, {
        method: "POST"
    });
    getItem(index).then(e => {
        e.json().then(j => {
            document.getElementById("down-count-"+index).innerText = j.votes_down;
        })
    });
}

// deno-lint-ignore no-unused-vars
function upvote(index) {
    // TODO only allow one vote per mod
    fetch(document.location.origin + "/api/upvote/" + index, {
        method: "POST"
    });
    getItem(index).then(e => {
        e.json().then(j => {
          document.getElementById("up-count-"+index).innerText = j.votes_up;
        })
    });
}

// deno-lint-ignore no-unused-vars
function submitFunction() {
    const name = document.getElementById("item_name").value;
    const link = document.getElementById("item_link").value;
   
    if (!validateName(name)) {
        notifyInvalid(name, "Malformed Name");
        return false;
    }
    
    if (!validateLink(link)) {
        notifyInvalid(link, "Invalid Link");
        return false;
    }
    
    return true;
}

function validateName(item) {
    // TODO validate 
    return true;
}

function validateLink(item) {
    try {
        url = new URL(item);
        if (url.host != "modrinth.com" && url.host != "curseforge.com") {
            return false;
        } 
    } catch (_) {
        return false;
    }
    return true;
}

function notifyInvalid(item, reason) {
    alert("\"" + item + "\"" + " is invalid." + "\n" + reason);
}

async function getItem(index) {
    // Javascript nerfed this function and I don't know why
    // I can't return the json object from here. The joy of using 
    // loosely typed ig.
    return fetch(document.location.origin + "/api/getitem/" + index);
}