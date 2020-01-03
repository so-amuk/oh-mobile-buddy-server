const router = require('express').Router();
const controller = require('./controller');

router.get("/all", controller.getAllUsers);
router.get("/:user", controller.getUser);

module.exports = router;