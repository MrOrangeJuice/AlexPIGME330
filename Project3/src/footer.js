// Footer Class
class Footer {
	constructor(name, year){
		this.name = name;
		this.year = year;
	}

	// Get name
	Name() {
		return this.name;
	}

	// Get year
	Year() {
		return this.year;
	}
}

export {Footer as default};