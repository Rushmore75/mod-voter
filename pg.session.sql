-- @block
drop table mods;
drop table packs;


-- @block
create TABLE IF NOT EXISTS packs (
    id TEXT PRIMARY KEY NOT NULL
);

-- @block
create TABLE IF NOT EXISTS mods (
    id TEXT NOT NULL,
    index INT NOT NULL,
    mod JSON NOT NULL,
    pack_id TEXT REFERENCES packs(id) NOT NULL,
    PRIMARY KEY(id, index)
);

