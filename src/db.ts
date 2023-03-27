import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://raw.githubusercontent.com/Rushmore75/denodb/master/mod.ts";

import { Item } from "./list.ts";

class Pack extends Model {
  static table = "packs";

  static fields = {
    id: { primaryKey: true, type: DataTypes.STRING },
  };
}

export class Mod extends Model {
  static table = "mods";
  static fields = {
    id: { primaryKey: true, type: DataTypes.STRING },
    mod: DataTypes.JSON,
    index: DataTypes.INTEGER
  };
  static pack() {
    return this.hasOne(Pack);
  }
}

const db: Database = await connect();

async function connect(): Promise<Database> {
    // TODO read these settings from config file
    const connection = new PostgresConnector({
        host: "172.17.0.3",
        username: "postgres",
        password: "1234",
        database: "modpacks",
    });

    const db = new Database(connection);
    
    // Relationships.belongsTo(Mod, Pack);

    db.link([Pack, Mod]);
    // await db.sync({ drop: false });
    return db;
}

function disconnect() {
    db?.close();
}

export async function addPack(id: string) {
    
    if (id.length > 255) {
        new Error("The pack ID is too long! At most can be 255 chars.")
        return;
    }

    await Pack.create({
        id: id,
    });
}

async function packExists(pack: string): Promise<boolean> {
    const db_pack = await Pack.where("id", pack).get();
    if (db_pack.length == 0) {
        return false
    }
    return true;
}

export async function addMod(pack: string, mod: Item) {
    if (!await packExists(pack)) {
        await addPack(pack);
    }
    // FIXME this isn't selecting anything
    const next = await Mod
        .where("pack_id", pack)
        .orderBy("index", "desc")
        .select("index")
        .first();
    let index = 0;
    try {
        if (next.length) {
            index = Number.parseInt(String(next.index)) + 1;
        }
    } catch (_) {/**/}
            
    await Mod.create({
        id: mod.name,
        mod: JSON.stringify(mod),
        pack_id: pack,
        index: index,
    });
}

export async function getMod(pack: string, index: number) {
    if (!await packExists(pack)) {
        await addPack(pack);
    }
    const item = await Mod
        .where("pack_id", pack)
        .where("index", String(index))
        .orderBy("index", "desc")
        .first();

    return item.mod;
}

export async function getAllItemsInPack(pack: string): Promise<any[]> {
    let result = await Mod.where("pack_id", pack).orderBy("index").select("mod").get();
    // If it is a single item, still put it in an array
    if (result instanceof Model) result = [result]; 
    // Parse Model -> Item
    const items = [];
    for (const i in result) {
        const element = result[i].mod;
        items.push(element);
    }
    return items;
}

export function downvoteMod(index: number, pack: string) {
    getMod(pack, index).then(e => {
        // This is dumb, ik, but it's the most concise way to do this. (I miss rust)
        const j = JSON.parse(JSON.stringify(e));
        j.votes_down++;
        Mod
            .where("pack_id", pack)
            .where("index", String(index))
            .update("mod", JSON.stringify(j));
    });
}

export function upvoteMod(index: number, pack: string) {
    getMod(pack, index).then(e => {
        const j = JSON.parse(JSON.stringify(e));
        j.votes_up++;
        Mod
            .where("pack_id", pack)
            .where("index", String(index))
            .update("mod", JSON.stringify(j));
    });
}
