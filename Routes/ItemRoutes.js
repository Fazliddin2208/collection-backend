const { createItem, getItems, getItem, updateItem, deleteItem } = require('../Controllers/ItemController')
const {user} = require('../Middlewares/AuthMiddlewares')
const upload = require('../utils/multer')

const router = require('express').Router();

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/create",user, upload.single('image'), createItem);
router.put("/:id", user, upload.single('image'), updateItem);
router.delete("/:id", user, deleteItem);

module.exports = router;