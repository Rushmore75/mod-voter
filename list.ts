class Item {
    name: string;
    link: URL;
    votes_up: number;
    votes_down: number;
    
    constructor(name: string, link: URL) {
        this.link = link;
        this.name = name;
        this.votes_down = 0;
        this.votes_up = 0;
    }
}

const items: Item[] = [];

export function getAllItems() {
    console.log(items.length);
    return JSON.stringify(items);
}

export function submitItem(name: string, link: URL) {
    const new_item: Item = new Item(name, link); 
    items.push(new_item);
    console.log("Added: "+name+": "+link);
    // console.log(items);
}

export function upvoteItem(item: number) {
    items[item].votes_up++;
}
export function downvoteItem(item: number) {
    items[item].votes_down++;
}

export function getItem(item: number) {
    return JSON.stringify(items[item]);
}
