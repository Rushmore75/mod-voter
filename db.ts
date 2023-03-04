import { DataTypes, Database, Model, PostgresConnector, Relationships } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";

const connection = new PostgresConnector({
  host: '172.17.0.2',
  username: 'postgres',
  password: '1234',
  database: 'postgres',
});

const db = new Database(connection);

class Pack extends Model {
  static table = 'packs';

  static fields = {
    id: { primaryKey: true, type: DataTypes.STRING },
  };
}

class Mod extends Model {
  static table = 'mods';
  static fields = {
    id: { primaryKey: true, type: DataTypes.STRING },
    mod: DataTypes.JSON,
  }
  static pack() {
    return this.hasOne(Pack);
  }
}

Relationships.belongsTo(Mod, Pack);

db.link([Pack, Mod]);
// await db.sync({ drop: false });

await Pack.create({
  id: "hi"
});

await Mod.create({
  id: "modmdo",
  mod: "{}",
  pack_id: "hi"
});
console.log("create");

console.log(Mod.select("id", "hi"));

db.close();