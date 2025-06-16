## Introduction

Lightweight library, robust and performant sequence-scrolling, easy to integrate, and compatible with your favorites smooth scrollers, by ex GSAP and Lenis
<br/>

## Features

## Installation

## Setup

## Settings

| Option                   | Type                | Default                            | Description                                                     |
| ------------------------ | ------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `canvas`                 | `HTMLCanvasElement` | `document.querySelector("canvas")` | The `HTMLCanvasElement` in which the animation will be rendered |
| `sequenceBaseUrlDesktop` | `string`            |                                    |                                                                 |
| `sequenceBaseUrlMobile`  | `string`            |                                    |                                                                 |
| `sequenceStartNumber`    | `string`            |                                    |                                                                 |
| `sequenceEndNumber`      | `string`            |                                    |                                                                 |
| `scrubTrigger`           | `HTMLElement`       |                                    |                                                                 |
| `scrubStart`             | `HTMLElement`       |                                    |                                                                 |
| `scrubEnd`               | `HTMLElement`       |                                    |                                                                 |

<br/>

### Problem we solve by using image sequences instead of videos

Scrolling trough video is pretty tricky and jerky due to the positions of the frames in the video's timeline.
The scroll and the video player won't be synced, so when the scroll will call the frame x of the video to to be displayed, sometime Javascript won't be able to find the good frame ( caused by frame interpolation).
It may cause some jerks ,or the video just wont play on firefox or safari.
Instead of spending many time to struggle with FFMPEG, simply use this solution, portable and performant.
<br/>

### On Resize

The canvas will be rendered as twice bigger than its direct parent for Device Pixel Ratio purpose, so the canvas parent must be its pure container without paddings
