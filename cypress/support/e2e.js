import "./commands/commands";
import "allure-cypress";
import "cypress-plugin-api";
import "cypress-plugin-steps";
import "cypress-plugin-xhr-toggle";

// Manejo de fechas con timezone
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Argentina/Buenos_Aires");

Cypress.fechaAR = (offset = 0) =>
  dayjs()
    .tz("America/Argentina/Buenos_Aires")
    .add(offset, "day")
    .format("DD/MM/YYYY");

require("cypress-terminal-report/src/installLogsCollector")({
  collectTypes: [
    "cy:command",
    "cy:log",
    "cons:log",
    "cons:warn",
    "cons:error",
    "cons:info",
  ],
});
