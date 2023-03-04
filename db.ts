import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
  Relationships,
} from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";

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

let db: Database = await connect();

async function connect(): Promise<Database> {
    // TODO read these settings from config file
    const connection = new PostgresConnector({
        host: "172.17.0.2",
        username: "postgres",
        password: "1234",
        database: "postgres",
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
    try {
        let next = await Mod
            .where("pack_id", pack)
            .orderBy("index", "desc")
            .select("index")
            .first();
            // .get();

        let index = 0;

        // if (next instanceof Model) next = [next];
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
    } catch (e) {
        console.error(e);
        console.error("MOD: "+mod);
        console.error("PACK: "+pack);
    }
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

export async function downvoteMod(index: number, pack: string) {
    getMod(pack, index).then(e => {
        const j = JSON.parse(JSON.stringify(e));
        j.votes_down++;
        // FIXME this isn't working
        // and it's not my fault.
        // But there is probably a
        // way to make it work.
        Mod
            .where("pack_id", pack)
            .where("index", String(index))
            .update("mod", j);
    });
}