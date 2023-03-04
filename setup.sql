
-- @block
drop table mods;
drop table packs;


-- @block
create TABLE IF NOT EXISTS packs (
    id CHAR(255) PRIMARY KEY NOT NULL
);

-- @block
create TABLE IF NOT EXISTS mods (
    id CHAR(255) PRIMARY KEY NOT NULL,
    mod JSON NOT NULL,
    pack_id CHAR(255) REFERENCES packs(id) NOT NULL
);

-- @block
drop table packs;
drop table mods;

-- @block
INSERT INTO mods (id, mod, pack_id)
VALUES (
    'other',
    '{}',
    '1234'
  );

-- @block
INSERT INTO packs (id)
VALUES ('1234');