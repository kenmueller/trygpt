-- User

DO $$ BEGIN CREATE DOMAIN USER_ID TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_CUSTOMER_ID TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_PAYMENT_METHOD TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_PHOTO TEXT CHECK (LENGTH(VALUE) > 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_NAME VARCHAR(150) CHECK (LENGTH(VALUE) > 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_EMAIL TEXT CHECK (LENGTH(VALUE) > 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_TOKENS INT CHECK (VALUE >= 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_PURCHASED_AMOUNT INT CHECK (VALUE >= 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN USER_PREVIEW_MESSAGES INT CHECK (VALUE >= 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

-- Chat

DO $$ BEGIN CREATE DOMAIN CHAT_ID TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN CHAT_NAME VARCHAR(150) CHECK (LENGTH(VALUE) > 0);
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

-- Chat message

DO $$ BEGIN CREATE DOMAIN CHAT_MESSAGE_ID TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE CHAT_MESSAGE_ROLE AS ENUM('system', 'user', 'assistant');
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

DO $$ BEGIN CREATE DOMAIN CHAT_MESSAGE_TEXT TEXT;
EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$;

-- Tables

CREATE TABLE IF NOT EXISTS users (
	id USER_ID NOT NULL PRIMARY KEY,
	customer_id USER_CUSTOMER_ID NOT NULL UNIQUE,
	payment_method USER_PAYMENT_METHOD,
	photo USER_PHOTO,
	name USER_NAME NOT NULL,
	email USER_EMAIL NOT NULL UNIQUE,
	last_charged TIMESTAMPTZ,
	prompt_tokens USER_TOKENS NOT NULL DEFAULT 0,
	completion_tokens USER_TOKENS NOT NULL DEFAULT 0,
	purchased_amount USER_PURCHASED_AMOUNT NOT NULL DEFAULT 0,
	preview_messages USER_PREVIEW_MESSAGES NOT NULL DEFAULT 0,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chats (
	user_id USER_ID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	id CHAT_ID NOT NULL PRIMARY KEY,
	original_id CHAT_ID REFERENCES chats(id),
	name CHAT_NAME, -- NULL initially. Immediately generate chat name from initial prompt.
	visible BOOLEAN NOT NULL DEFAULT TRUE,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS chat_messages (
	chat_id CHAT_ID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
	id CHAT_MESSAGE_ID NOT NULL PRIMARY KEY,
	role CHAT_MESSAGE_ROLE NOT NULL,
	text CHAT_MESSAGE_TEXT NOT NULL,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
