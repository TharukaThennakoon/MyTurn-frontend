export * from "./apiClient";
export * from "./authService";
export * from "./bookingService";
export * from "./stationService";
export * from "./timeSlotService";
export * from "./queueService";
export * from "./notificationService";
export * from "./dashboardService";

import apiClient from "./apiClient";
import authService from "./authService";
import bookingService from "./bookingService";
import stationService from "./stationService";
import timeSlotService from "./timeSlotService";
import queueService from "./queueService";
import notificationService from "./notificationService";
import dashboardService from "./dashboardService";

export {
  apiClient,
  authService,
  bookingService,
  stationService,
  timeSlotService,
  queueService,
  notificationService,
  dashboardService,
};

const services = {
  apiClient,
  auth: authService,
  booking: bookingService,
  station: stationService,
  timeSlot: timeSlotService,
  queue: queueService,
  notification: notificationService,
  dashboard: dashboardService,
};

export default services;
