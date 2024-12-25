CREATE TABLE "companies" (
	"id"           UUID  DEFAULT uuid_v6(),
	"master"       UUID  NOT NULL,
	"name"         TEXT  NOT NULL,
	"system"       TEXT  NOT NULL,
	"description"  TEXT,

	CONSTRAINT "PK_companies" PRIMARY KEY ("id"),
	CONSTRAINT "FK_companies_users" FOREIGN KEY ("master")
		REFERENCES "users"("id")
		ON DELETE SET NULL
);
