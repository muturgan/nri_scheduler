CREATE TABLE "events" (
	"id"         UUID  DEFAULT uuid_v6(),
	"company"    UUID  NOT NULL,
	"location"   UUID,
	"date"       TIMESTAMPTZ,

	CONSTRAINT "PK_events" PRIMARY KEY ("id"),
	CONSTRAINT "FK_events_companies" FOREIGN KEY ("company")
		REFERENCES "companies"("id")
		ON DELETE CASCADE,
	CONSTRAINT "FK_events_locations" FOREIGN KEY ("location")
		REFERENCES "locations"("id")
		ON DELETE SET NULL
);
