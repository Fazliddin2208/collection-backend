const {createCollection, getCollections, updateCollection, deleteCollection,getLargestCollections, getCollection,like} = require('../Controllers/CollectionController')
const {user} = require('../Middlewares/AuthMiddlewares')
const upload = require('../utils/multer')

const router = require('express').Router();

router.get("/", getCollections);
router.get("/:id", getCollection)
router.post("/create",user, upload.single('image'), createCollection);
router.put("/:id", upload.single('image'), updateCollection);
router.delete("/:id", deleteCollection);
router.get("/largest", getLargestCollections)

module.exports = router;