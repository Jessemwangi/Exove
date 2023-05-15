'use strict';
import Express from "express";
import { getNotiSetting, getNotiSettings, patchNotiSetting, postNotiSetting, updatedNotisetting } from "../controllers/notificationSettingController.js";
export const notiSettingRoute = Express.Router();
notiSettingRoute.get('/', getNotiSettings);
notiSettingRoute.get('id/:id', getNotiSetting);
notiSettingRoute.post('/', postNotiSetting);
notiSettingRoute.put('/:id', updatedNotisetting);
notiSettingRoute.patch('update/id', patchNotiSetting);
//# sourceMappingURL=notiSettingRoute.js.map