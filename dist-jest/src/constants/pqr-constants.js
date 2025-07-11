export var PQRStatus;
(function (PQRStatus) {
    PQRStatus["OPEN"] = "OPEN";
    PQRStatus["CATEGORIZED"] = "CATEGORIZED";
    PQRStatus["ASSIGNED"] = "ASSIGNED";
    PQRStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PQRStatus["WAITING"] = "WAITING";
    PQRStatus["RESOLVED"] = "RESOLVED";
    PQRStatus["CLOSED"] = "CLOSED";
    PQRStatus["REOPENED"] = "REOPENED";
    PQRStatus["CANCELLED"] = "CANCELLED";
})(PQRStatus || (PQRStatus = {}));
export var PQRNotificationTemplate;
(function (PQRNotificationTemplate) {
    PQRNotificationTemplate["STATUS_CHANGE_ASSIGNED"] = "STATUS_CHANGE_ASSIGNED";
    PQRNotificationTemplate["STATUS_CHANGE_IN_PROGRESS"] = "STATUS_CHANGE_IN_PROGRESS";
    PQRNotificationTemplate["STATUS_CHANGE_RESOLVED"] = "STATUS_CHANGE_RESOLVED";
    PQRNotificationTemplate["STATUS_CHANGE_CLOSED"] = "STATUS_CHANGE_CLOSED";
    PQRNotificationTemplate["STATUS_CHANGE_REOPENED"] = "STATUS_CHANGE_REOPENED";
    PQRNotificationTemplate["DEFAULT"] = "DEFAULT";
})(PQRNotificationTemplate || (PQRNotificationTemplate = {}));
