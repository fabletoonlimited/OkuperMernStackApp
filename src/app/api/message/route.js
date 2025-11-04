import {sendMessage} from "../controllers/message.controller.js"

const route = express.Router();

route.post("/", sendMessage);

export default route;