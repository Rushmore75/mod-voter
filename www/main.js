const pack_cookie_id = "Pack-Id";

loadList()

function loadList() {
    try {       
        // get the current list from the backend
        fetch(document.location.origin + "/api/getlist")
            .then(res => {
                const html_list = document.getElementById("list");
                res.json().then(json => {
                    for (const i in json) {
                        const up_count = json[i].votes_up;
                        const down_count = json[i].votes_down;
                        const item = 
                            `<div class="list-item"><button type="button" class="vote" onclick="upvote(${i})">up</button>
                                <p class="up-count" id="up-count-${i}">${up_count}</p>
                                <p>
                                    <a href="${json[i].link}">${json[i].name}</a>
                                </p>
                                <p class="down-count" id="down-count-${i}">${down_count}</p><button type="button" class="vote" onclick="downvote(${i})">down</button>
                            </div>`
                        // add
                        html_list.insertAdjacentHTML("beforeend", item);
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

function changePack() {
    const new_id = document.getElementById("pack-id").value;
    // This is because the database is set up for 255 chars
    if (String(new_id).length >= 255) {
        alert("Use a shorter name");
        return false;
    }
    console.log("Changing from pack: "+ getPackId() +" to: "+ new_id);
    document.cookie = `${pack_cookie_id}=${new_id};`;
    loadList();
    // return false; // cancel the form submission.
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

function getPackId() {
    const cookies = document.cookie.split(';');
    for (const i in cookies) {
        const parts = cookies[i].split('=');
        if (parts[0] == pack_cookie_id) {
            return parts[1];
        } 
    }
}
