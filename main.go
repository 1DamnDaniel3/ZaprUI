package main

import (
	"context"
	"embed"
	"os/exec"
	logger "zaprUI/backend/Logger"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "zaprUI",
		Width:  400,
		Height: 600,

		MinWidth:  400, // минимальная ширина
		MaxWidth:  400, // максимальная ширина
		MinHeight: 600, // минимальная высота
		MaxHeight: 600, // максимальная высота

		Frameless:         true,
		CSSDragProperty:   "widows",
		CSSDragValue:      "1",
		HideWindowOnClose: true,

		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 202, G: 210, B: 197, A: 1},
		OnStartup:        app.startup,
		OnShutdown: func(ctx context.Context) {
			exec.Command("sc", "stop", "WinDivert").Run()
			app.Logger.Info("Shut down")
		},

		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}

}

var isTrayRunning bool

// ========== Tray routine =============

func runTray(ctx context.Context, logger logger.Logger) {

	if isTrayRunning {
		return
	}

	isTrayRunning = true

	go func() {
		systray.Run(func() {
			onReady(ctx, logger)
		}, func() {})
	}()

}

func onReady(ctx context.Context, logger logger.Logger) {
	systray.SetTitle("ZaprUI")
	systray.SetTooltip("ZaprUI")

	iconBytes, err := assets.ReadFile("frontend/dist/assets/icon.defcbce1.ico")
	if err != nil {
		logger.Error(err)
		panic(err)
	}

	systray.SetIcon(iconBytes)

	mShow := systray.AddMenuItem("Показать", "Показать окно")
	mHide := systray.AddMenuItem("Скрыть", "Скрыть окно")
	systray.AddSeparator()
	mQuit := systray.AddMenuItem("Выход", "Закрыть приложение")

	go func() {
		for {
			select {
			case <-mShow.ClickedCh:
				runtime.WindowShow(ctx)

			case <-mHide.ClickedCh:
				runtime.WindowHide(ctx)

			case <-mQuit.ClickedCh:
				runtime.Quit(ctx)
				return

			}
		}
	}()
}
