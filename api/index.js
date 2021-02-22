const uuid = require("uuid").v4;

module.exports = async (req, res) => {
    const seed = uuid();

    res.redirect("/" + seed);
}