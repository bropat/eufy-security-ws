export enum StationCommand {
    reboot = "station.reboot",
    isConnected = "station.is_connected",
    connect = "station.connect",
    disconnect = "station.disconnect",
    getPropertiesMetadata = "station.get_properties_metadata",
    getProperties = "station.get_properties",
    setProperty = "station.set_property",
    hasProperty = "station.has_property",
    triggerAlarm = "station.trigger_alarm",
    resetAlarm = "station.reset_alarm",
    getCommands = "station.get_commands",
    hasCommand = "station.has_command",
    //    getCameraInfo = "station.get_camera_info",
    //    getStorageInfo = "station.get_storage_info",

    //Deprecated
    setGuardMode = "station.set_guard_mode",

    //Legacy
    isConnectedLegacy = "station.isConnected",
}
