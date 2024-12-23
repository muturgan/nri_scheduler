CREATE TABLE "applications" (
	"id"         UUID  DEFAULT uuid_v6(),
	"player"     UUID  NOT NULL,
	"event"      UUID  NOT NULL,
	"approval"   BOOL  DEFAULT NULL,

	CONSTRAINT "PK_applications" PRIMARY KEY ("id"),
	CONSTRAINT "FK_applications_users" FOREIGN KEY ("player")
		REFERENCES "users"("id")
		ON DELETE CASCADE,
	CONSTRAINT "FK_applications_events" FOREIGN KEY ("event")
		REFERENCES "events"("id")
		ON DELETE CASCADE
);
