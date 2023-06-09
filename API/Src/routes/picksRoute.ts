import express from 'express';
import { WhoToGiveFeedbackTo, createRequestPicks, finalPickSubmit, getAllRequestPicks, getIdRequestPick, getUserRequestPick, hrApprovesPicks, hrMassApprovesPicks, submitRequestPicks } from "../controllers/requestpicksController.js";
export const reqPicksRoutes = express.Router()



reqPicksRoutes.get('/', getAllRequestPicks); // get all request picks  path :  /picks/
reqPicksRoutes.get('/pick-id/:id', getIdRequestPick);
reqPicksRoutes.get('/:id',getUserRequestPick); // get individual requestpicks after an hr has created it /picks/{userId}
reqPicksRoutes.post('/', createRequestPicks);   //Hr create a requestpicks Path : /picks/createreqpick
reqPicksRoutes.patch('/:id', submitRequestPicks);   //add the selected list of five one at time : /picks/{id}  
reqPicksRoutes.patch('/approve-pick/:id', hrApprovesPicks);   // approve or disapprove a single request pick /picks/approve-pickload >> {}
reqPicksRoutes.patch('/approve-picks/:id', hrMassApprovesPicks);   // approve or disapprove a multiple request picks /picks/approve-picks  load: >> "SelectedList": [{}]
reqPicksRoutes.delete('/:id',);
reqPicksRoutes.patch('/submit/:id', finalPickSubmit);
reqPicksRoutes.get('/feeds_to/:name',WhoToGiveFeedbackTo); //get all the user i am supposed to give feedback to


