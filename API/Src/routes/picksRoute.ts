import express from 'express';
import { createRequestPicks, getAllRequestPicks, getUserRequestPick, hrApprovesPicks, hrMassApprovesPicks, submitRequestPicks } from "../controllers/requestpicksController.js";
export const reqPicksRoutes = express.Router()



reqPicksRoutes.get('/', getAllRequestPicks); // get all request picks  path :  /picks/
reqPicksRoutes.get('/:id',getUserRequestPick); // get individual requestpicks after an hr has created it /picks/{userId}
reqPicksRoutes.post('/createreqpick', createRequestPicks);   //Hr create a requestpicks Path : /picks/createreqpick
reqPicksRoutes.patch('/sendreqpick', submitRequestPicks);   //Hr create a requestpicks Path : /picks/createreqpick  
reqPicksRoutes.patch('/approve-pick', hrApprovesPicks);   // approve or disapprove a single request pick /picks/approve-pickload >> {}
reqPicksRoutes.patch('/approve-picks', hrMassApprovesPicks);   // approve or disapprove a multiple request picks /picks/approve-picks  load: >> "SelectedList": [{}]
reqPicksRoutes.delete('/:id',);

