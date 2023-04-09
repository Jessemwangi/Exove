import { Request, Response } from "express";
import { IRequestPicks } from "../dbcontext/Interfaces.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { checkUserRoles } from "../utilities/functions.js";

export const getFeeds = (req: Request, res: Response) => {
  res.status(200).json("Hi, see you want feedback");
};

// will be executed by the hr
export const requestPicks = async (req: Request, res: Response) => {
  const requestHttpData: IRequestPicks = req.body;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c"; // req.cookies.access_token;
  if (!token) return res.status(401).json("Not Authenticated!");
  jwt.verify(
    token,
    "s3cr3t",
    async (
      err: jwt.VerifyErrors | null,
      userInfo: string | jwt.JwtPayload | undefined
    ) => {
      if (err) return res.status(403).json("Authentication token Not Valid");

      try {
          if (requestHttpData) {
              const rolelevel = await checkUserRoles(requestHttpData.requestedBy)
              if (typeof rolelevel === 'string') {
                  res.status(200).json(rolelevel);
                  return;
              }
              if (typeof rolelevel === "number" && rolelevel < 3) {
                res.status(200).json('Not authorised');
                return;
              }
          const requestData: IRequestPicks = {
            _id: uuidv4(),
            requestedTo: requestHttpData.requestedTo,
            requestedBy: requestHttpData.requestedBy, // will will get this info from token when we encrypt
            requestedOn: new Date(),
            SelectedList: [],
            submitted: false,
            submittedOn: null,
          };
          console.log(requestData);
          const requestInstance = new RequestPicks(requestData);
          const validationError = requestInstance.validateSync();

          if (validationError) {
            res.status(400).json({ message: validationError.message });
            return;
          }
          await dbconnect();
          await requestInstance.save();
          res.status(200).json("Data saved successfully!");
          await dbclose();
        } else {
          res.status(404).json("Post data not found or empty");
        }
      } catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
      }
    }
  );
};

const submitRequestPicks =async (req:Request,res:Response) => {
    
}