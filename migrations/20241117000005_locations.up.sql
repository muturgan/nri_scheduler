CREATE TABLE "locations" (
	"id"           UUID  DEFAULT uuid_v6(),
	"name"         TEXT  NOT NULL,
	"address"      TEXT,
	"description"  TEXT,

	CONSTRAINT "PK_locations" PRIMARY KEY ("id")
);