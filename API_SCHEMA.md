# API Schema

This document describes the changes that are introduced with each schema version.

## Schema 0

Base schema.

## Schema 1

* Added `type`property to Device and Station

## Schema 2

* Added new commands `startLivestream`, `stopLivestream` and `isLiveStreaming` to Device
* Added new Device events `livestreamStarted`,`livestreamStopped`, `livestreamVideoData` and `livestreamAudioData`
