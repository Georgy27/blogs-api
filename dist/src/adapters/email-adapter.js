"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const inversify_1 = require("inversify");
let EmailAdapter = class EmailAdapter {
    sendEmail(email, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_EMAIL,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
            let result = yield transporter.sendMail({
                from: `"Georgy" ${process.env.GMAIL_PASSWORD}`,
                to: email,
                subject: "Attachments",
                html: message,
            });
            return result;
        });
    }
};
EmailAdapter = __decorate([
    (0, inversify_1.injectable)()
], EmailAdapter);
exports.EmailAdapter = EmailAdapter;
