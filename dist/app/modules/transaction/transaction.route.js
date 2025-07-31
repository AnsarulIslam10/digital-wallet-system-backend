"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const transaction_validation_1 = require("./transaction.validation");
const router = express_1.default.Router();
// USER routes
router.post('/add', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(transaction_validation_1.addMoneyValidation), transaction_controller_1.TransactionController.addMoney);
router.post('/withdraw', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(transaction_validation_1.withdrawMoneyValidation), transaction_controller_1.TransactionController.withdrawMoney);
router.post('/send', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(transaction_validation_1.sendMoneyValidation), transaction_controller_1.TransactionController.sendMoney);
// AGENT routes
router.post('/cash-in', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.agentCashInValidation), transaction_controller_1.TransactionController.agentCashIn);
router.post('/cash-out', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.agentCashOutValidation), transaction_controller_1.TransactionController.agentCashOut);
// Shared
router.get('/my-history', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), transaction_controller_1.TransactionController.getMyHistory);
// ADMIN routes
router.get('/', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), transaction_controller_1.TransactionController.getAll);
router.get('/my-commissions', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), transaction_controller_1.TransactionController.getAgentCommissions);
exports.TransactionRoutes = router;
