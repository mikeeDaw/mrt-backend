import express from "express";
import { MobileTapModel } from "../models/mobileTapModel";
import { cardModel } from "../models/CardModel";

export const newTapIn = async (req: express.Request, res: express.Response) => {
  try {
    const toUpdate = req.body;
    delete toUpdate._id;
    console.log(toUpdate);
    const data = await MobileTapModel.findOneAndReplace(
      { _id: "65e74886ac6d1568ceb7612b" },
      { ...toUpdate },
      { new: true, timestamps: true }
    );
    // const updateOrig = await cardModel.findOneAndUpdate(
    //   { uid: toUpdate.uid },
    //   toUpdate,
    //   { new: true }
    // );
    // console.log(
    //   data?.uid,
    //   "in MobileTap:",
    //   data?.tapped,
    //   data?.balance,
    //   "in Orig:",
    //   updateOrig?.tapped,
    //   updateOrig?.balance
    // );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: "No Document Found." });
  }
};
