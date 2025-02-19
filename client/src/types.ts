export interface Master {
	name: string;
	location_id: string;
}

export interface Character {
	name: string;
	class: string;
	race: string;
	level: number;
	abilities: {
		strength: number;
		dexterity: number;
		constitution: number;
		intelligence: number;
		wisdom: number;
		charisma: number;
	};
	inventory: string[];
}

export interface Player {
	id: string;
	name: string;
}

export interface Story {
	title: string;
	description: string;
	setting: string;
}

export interface SessionDetails {
	date: string;
	duration: string;
	location: string;
	notes: string;
}

export interface GameSession {
	master: Master;
	story: Story;
	players: Player[];
	sessionDetails: SessionDetails;
}
