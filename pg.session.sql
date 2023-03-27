-- @block
drop table mods;
drop table packs;


-- @block
create TABLE IF NOT EXISTS packs (
    id VARCHAR(255) PRIMARY KEY NOT NULL
);

create TABLE IF NOT EXISTS mods (
    id TEXT NOT NULL,
    index INT NOT NULL,
    mod JSON NOT NULL,
    pack_id VARCHAR(255) REFERENCES packs(id) NOT NULL,
    PRIMARY KEY(id, index)
);

