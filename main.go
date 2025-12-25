package main

import (
	"context"
	"embed"
	"os/exec"
	"sync"
	"syscall"
	"unsafe"
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
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		OnStartup:        app.startup,
		OnShutdown: func(ctx context.Context) {
			app.Logger.Info("Shut down")
			if isAdmin() {
				exec.Command("sc", "stop", "zapret").Run()
				exec.Command("sc", "stop", "WinDivert").Run()
			}
		},

		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		app.Logger.Error(err)
		println("Error:", err.Error())
	}

}

var trayOnce sync.Once

func runTray(ctx context.Context, logger logger.Logger) {
	trayOnce.Do(func() {
		go systray.Run(func() {
			onReady(ctx, logger)
		}, func() {})
	})
}

var windowWisible bool

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
				if !windowWisible {
					logger.Info("Show window from tray")
					runtime.WindowShow(ctx)
					windowWisible = true
				}

			case <-mHide.ClickedCh:
				if windowWisible {
					logger.Info("Close window from tray")
					runtime.WindowHide(ctx)
					windowWisible = false
				}

			case <-mQuit.ClickedCh:
				logger.Info("Quit from tray")
				runtime.Quit(ctx)
				return

			}
		}
	}()
}

func isAdmin() bool {
	h, err := syscall.GetCurrentProcess()
	if err != nil {
		return false
	}

	var token syscall.Token
	err = syscall.OpenProcessToken(h, syscall.TOKEN_QUERY, &token)
	if err != nil {
		return false
	}
	defer token.Close()

	var elevation uint32
	var outLen uint32

	err = syscall.GetTokenInformation(
		token,
		syscall.TokenElevation,
		(*byte)(unsafe.Pointer(&elevation)),
		uint32(unsafe.Sizeof(elevation)),
		&outLen,
	)
	return err == nil && elevation != 0
}

// $env:CGO_ENABLED="1"; wails build -o ./ZaprUI.exe
