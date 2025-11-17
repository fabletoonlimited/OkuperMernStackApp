import {sendMessage} from "../controllers/messages.controller.js"

const route = express.Router();

route.post("/", sendMessage);

export default route;