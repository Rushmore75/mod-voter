import { addMod, downvoteMod, getAllItemsInPack, getMod, Mod } from "./db.ts";

export class Item {
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


export function submitItem(name: string, link: URL, pack: string) {
    const new_item: Item = new Item(name, link); 
    addMod(pack, new_item);
}

export function upvoteItem(item: number, pack: string) {
    // FIXME upvote
    // items[item].votes_up++;
}
export function downvoteItem(item: number, pack: string) {
    // FIXME downvote
    downvoteMod(item, pack);
    // items[item].votes_down++;
}
