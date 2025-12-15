package main

import (
	"context"
	"fmt"
	"os"
	"zaprUI/backend/updater"
	"zaprUI/backend/using"
	"zaprUI/backend/utils"
)

// App struct
type App struct {
	ctx     context.Context
	WorkDir string
	Bats    map[int]string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// find AppData Path
	appDir := utils.GetAppDataPath("ZaprUI")
	a.WorkDir = appDir // push to type
	// creating WORKDIR in User/AppData/Roaming
	if err := ensureAppDir(appDir); err != nil {
		panic(err)
	}
	// fetching GitHub Repo
	switch updater.IsGitRepo(appDir) {
	case true:
		if err := updater.UpdateRepo(appDir, "main"); err != nil {
			panic(err)
		}
	case false:
		if err := updater.CloneRepo("https://github.com/Flowseal/zapret-discord-youtube.git", appDir); err != nil {
			panic(err)
		}
	}

	a.Bats = using.FindBats(appDir)
}

func (a *App) RunBat(id int) error {
	return using.RunBat(a.Bats, id)
}

// Getting sure that ProjectDir created
func ensureAppDir(path string) error {
	return os.MkdirAll(path, 0755)
}

/*
-
-
-
-
-
-
-
*/
// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
