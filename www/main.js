
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
                        // add
                        element.appendChild(content);
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

function downvote(index) {
    console.log("down" + index);
    fetch(document.location.origin + "/api/downvote/" + index, {
        method: "POST"
    });
}

function upvote(index) {
    console.log("up" + index);
    fetch(document.location.origin + "/api/upvote/" + index, {
        method: "POST"
    });
}

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