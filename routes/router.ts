import express, { response } from "express";
import { adminModel } from "../models";
import { login, register, isAuthenticated } from "../controller/authentication";
import {
  generateCard,
  getAllCards,
  deleteCard,
  updateLoad,
  getOneCard,
  TapInCard,
  TapOutCard,
  getCardsMobile,
  TapOutMobile,
} from "../controller/beepCard";
import {
  makeStation,
  getAllStations,
  updateStation,
  delStation,
} from "../controller/trainStation";
import {
  getConstant,
  updConstDocu,
  updMaintenance,
} from "../controller/constants";
import { newTapIn } from "../controller/mobile";

const router = express.Router();

// router.get('/:station', (req, res) => {
//     let a = req.params
//     res.json({msg: a.station })
//  });

// Add new admin document
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // .create() returns the created document.
    const admin = await adminModel.create({ email, password });
    res.status(200).json({ admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.json();
});

// Admin registration
router.post("/auth/register", register);

// Admin Login
router.post("/auth/login", login);

router.post("/authVerify/xd", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

// Card Operations
router.post("/beep/generate", isAuthenticated, generateCard);
router.post("/beep/getOne", getOneCard);
router.get("/beep/fetchAll", isAuthenticated, getAllCards);
router.delete("/beep/deleteCard", isAuthenticated, deleteCard);
router.patch("/beep/load", isAuthenticated, updateLoad);
router.patch("/beep/tapIn", TapInCard);
router.patch("/beep/tapOut", TapOutCard);
router.post("/beep/cards/mobile", getCardsMobile);

// Station Operations
router.post("/station/add", isAuthenticated, makeStation);
router.get("/station/get/all", getAllStations);
router.patch("/station/updateStat", isAuthenticated, updateStation);
router.delete("/station/deleteMe", isAuthenticated, delStation);

// Constant Operations
router.get("/constants/get", getConstant);
router.patch("/constants/edit", isAuthenticated, updConstDocu);
router.patch("/constants/maintenance", isAuthenticated, updMaintenance);

// From Mobile
router.patch("/mobile/tapIn", newTapIn);
router.patch("/mobile/tapOut", TapOutMobile);

export default router;
