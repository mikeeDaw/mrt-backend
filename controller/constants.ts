import express from "express";
import {
  createConst,
  getConstById,
  updateConst,
} from "../models/ConstantModel";
import { getCards } from "../models/CardModel";

export const getConstant = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const data = await getConstById("Constant");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: "No Document Found." });
  }
};

export const updConstDocu = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const data = {
    penalty: req.body.penalty,
    farePerKM: req.body.farePerKM,
    minFare: req.body.minFare,
    minLoad: req.body.minLoad,
  };
  console.log(data);
  try {
    const docu = await getConstById("Constant");

    if (!docu) {
      return res.status(400).json({ message: "Document was not Found." });
    }

    try {
      const updating = await updateConst("Constant", data);
      return res.status(200).json({ msg: "Document was Updated!" });
    } catch (error) {
      return res.status(400).json({ msg: "Update was not Successful." });
    }
  } catch (error) {}
};

export const updMaintenance = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const maint = { maintenance: req.body.maintenance };

  if (maint.maintenance) {
    const cards = await getCards();
    const noIn = cards.every((item) => {
      console.log(item.tapped);
      return item.tapped !== true;
    });

    if (!noIn) {
      console.log("error area");
      return res.status(401).json({ msg: "There is Someone" });
    }
  }

  console.log("outside the error");
  const docu = await getConstById("Constant");

  if (!docu) {
    return res.status(400).json({ msg: "Document not Found." });
  }
  try {
    const updated = await updateConst("Constant", maint);
    console.log(maint);
    return res.status(200).json({ data: updated });
  } catch (error) {
    res.status(400).json({ msg: "Error in Updating." });
  }
};
