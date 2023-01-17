const { register, login, getUsers, deleteUser, updateStatus, updateAdmin,getProfile } = require('../Controllers/AuthControllers')
const { checkUser, checkAdmin } = require("../Middlewares/AuthMiddlewares");

const router = require('express').Router();

router.get("/me", checkUser, getProfile);
router.get('/',getUsers);
router.post("/register", register);
router.post("/login", login);
router.delete("/:id", checkAdmin, deleteUser);
router.put('/:id', checkAdmin, updateStatus)
router.put('/admin/:id', checkAdmin, updateAdmin)

module.exports = router;