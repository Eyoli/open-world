import {Application} from "pixi.js";
import {Viewport} from "pixi-viewport";

export const createAdminViewport = (app: Application, width: number, height: number) => {
    // create the viewport
    // viewport = new Viewport({    // use with modern build toolchain
    // @ts-ignore
    const viewport = new Viewport({
        // screenWidth: window.innerWidth,              // screen width used by viewport (eg, size of canvas)
        // screenHeight: window.innerHeight,            // screen height used by viewport (eg, size of canvas)
        worldWidth: width,                        // world width used by viewport (automatically calculated based on container width)
        worldHeight: height,                      // world height used by viewport (automatically calculated based on container height)
        // threshold: 5,                                // number of pixels to move to trigger an input event (e.g., drag, pinch) or disable a clicked event
        passiveWheel: false,                            // whether the 'wheel' event is set to passive (note: if false, e.preventDefault() will be called when wheel is used over the viewport)
        // stopPropagation: false,                      // whether to stopPropagation of events that impact the viewport (except wheel events, see options.passiveWheel)
        // forceHitArea: null,                          // change the default hitArea from world size to a new value
        // noTicker: false,                             // set this if you want to manually call update() function on each frame
        // ticker: Ticker.shared,                  // use this PIXI.ticker for updates
        // divWheel: null,                              // div to attach the wheel event (uses document.body as default)
        // disableOnContextMenu: false,                 // remove oncontextmenu=() => {} from the divWheel element
        events: app.renderer.events
    })

    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    // fit and center the world into the panel
    viewport.fit()
    viewport.moveCenter(width / 2, height / 2)

    return viewport
}
