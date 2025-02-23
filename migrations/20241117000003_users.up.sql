CREATE TABLE "users" (
	"id"         UUID  DEFAULT uuid_v6(),
	"nickname"   VARCHAR(32) NOT NULL,
	"phone"      VARCHAR(32) DEFAULT NULL,
	"email"      VARCHAR(32) DEFAULT NULL UNIQUE,
	"pw_hash"    CHAR(66)    NOT NULL,
	"timezone_offset" smallint
							CONSTRAINT timezone_offset_check CHECK (timezone_offset >= -12 and timezone_offset <= 12)
							DEFAULT NULL,

	CONSTRAINT "PK_users" PRIMARY KEY ("id")
);
