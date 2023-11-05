const client = require("../index");

module.exports = {
    name: "error", 
    run: async(error) => {
    	console.error(error);
	}
};