import express from "express";
import {
  createStation,
  getStations,
  updateStationByCode,
  getStationByCode,
  StationModel,
  deleteStationByCode,
} from "../models/stationModel";

export const makeStation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, code, connected, coordinates } = req.body;

  try {
    const data = await createStation({ name, code, connected, coordinates });

    connected.forEach(async (codeAdd: string) => {
      await StationModel.updateOne(
        { code: codeAdd },
        {
          $push: {
            connected: code,
          },
        }
      );
    });

    console.log(data);
    res.status(200).json({ message: "Creation Done!" });
  } catch (error) {
    console.log("Error: Creation Not Successful.", error);
    res.status(400).json({ message: "Creation Failed." });
  }
};

export const getAllStations = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const sample = req.body;
  try {
    const data = await getStations();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: "Error in Getting Data" });
    console.log("Error in catch");
  }
};

export const updateStation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { origCode, name, code, connRem, connAdd, connStay, coordinates } =
    req.body;

  try {
    const updated = await updateStationByCode(origCode, {
      name,
      code,
      connected: [...connStay, ...connAdd],
      coordinates,
    });

    // add connection to the target stations
    if (connAdd.length !== 0) {
      connAdd.forEach(async (codeAdd: string) => {
        await StationModel.updateOne(
          { code: codeAdd },
          {
            $push: {
              connected: code,
            },
          }
        );
      });
    }

    // remove connection to target stations
    if (connRem.length !== 0) {
      connRem.forEach(async (codeRem: string) => {
        await StationModel.updateOne(
          { code: codeRem },
          {
            $pull: {
              connected: code,
            },
          }
        );
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update Failed." });
  }
};

export const delStation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, code, connected } = req.body;
  console.log(connected, typeof connected, code, typeof code);

  try {
    const deleted = await deleteStationByCode(code);

    connected.forEach(async (codeRem: string) => {
      await StationModel.updateOne(
        { code: codeRem },
        {
          $pull: {
            connected: code,
          },
        }
      );
    });
    res.status(200).json({ msg: `Deletion of ${name} STATION is completed.` });
  } catch (error) {
    res.status(400).json({ msg: "Error! Failed Deletion." });
    console.log(error);
  }
};
