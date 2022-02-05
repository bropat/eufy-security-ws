export enum DriverCommand {
    setVerifyCode = "driver.set_verify_code",
    setCaptcha = "driver.set_captcha",
    pollRefresh = "driver.poll_refresh",
    isConnected = "driver.is_connected",
    isPushConnected = "driver.is_push_connected",
    connect = "driver.connect",
    disconnect = "driver.disconnect",
    getAlarmEvents = "driver.get_alarm_events",
    getVideoEvents = "driver.get_video_events",
    getHistoryEvents = "driver.get_history_events",
    setLogLevel = "driver.set_log_level",
    getLogLevel = "driver.get_log_level",
    startListeningLogs = "driver.start_listening_logs",
    stopListeningLogs = "driver.stop_listening_logs",
    isMqttConnected = "driver.is_mqtt_connected",

    //Legacy commands
    isConnectedLegacy = "driver.isConnected",
    isPushConnectedLegacy = "driver.isPushConnected",
}
