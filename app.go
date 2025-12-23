package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"
	logger "zaprUI/backend/Logger"
	"zaprUI/backend/updater"
	"zaprUI/backend/using"
	"zaprUI/backend/utils"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context

	ProjectDir      string
	Temp            string
	ReleaseDir      string
	VersionFilePath string

	Bats   map[int]string
	Runner *using.BatRunner
	Logger logger.Logger
}

// NewApp creates a new App application struct
func NewApp() *App {

	// find AppData Path
	appDir := utils.GetAppDataPath("ZaprUI")
	temp := appDir + "/temp"
	releaseDir := appDir + "/release"

	logger := logger.NewLogger(appDir)

	return &App{
		Runner:     &using.BatRunner{},
		ProjectDir: appDir,
		Temp:       temp,
		ReleaseDir: releaseDir,
		Logger:     *logger,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// ===========================

	//============================

	// creating ProjectDir in User/AppData/Roaming/
	if err := ensureAppDir(a.ProjectDir); err != nil {
		panic(fmt.Errorf("❗error creating app directory in AppData: %w", err))
	}
	if err := ensureAppDir(a.Temp); err != nil { // temp dir for sessions data files
		panic(fmt.Errorf("❗error creating gitrepo directory in project dir: %w", err))
	}
	if err := ensureAppDir(a.ReleaseDir); err != nil { // release repo
		panic(fmt.Errorf("❗error creating release dir: %w", err))
	}

	// == fetching GitHub Repo
	// switch updater.IsGitRepo(gitDir) {
	// case true:
	// 	if err := updater.UpdateRepo(gitDir, "main"); err != nil {
	// 		panic(fmt.Errorf("❗error updating git repo: %w", err))
	// 	}
	// case false:
	// 	if err := updater.CloneRepo("https://github.com/Flowseal/zapret-discord-youtube.git", gitDir); err != nil {
	// 		panic(fmt.Errorf("❗error with clone repo in gitRepo: %w", err))
	// 	}
	// }

	// =============================================== fetching ReleaseRepo

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	release, err := updater.ParceLatestRelease(client) // Asking GitHub Releases about latest
	if err != nil {
		a.Logger.Error(err)
		panic(fmt.Errorf("❗error parce latest release: %v", err))
	}
	if err := updater.EnsureVersionFileExist(a.ProjectDir, release); err != nil { //  Check VersionFile
		a.Logger.Error(err)
		panic(fmt.Errorf("❗version file ensure error: %v", err))
	}
	a.VersionFilePath = filepath.Join(a.ProjectDir, "release_version.txt")

	latest, err := updater.IsLatestVersion(a.VersionFilePath, release) // Trying version
	if err != nil {
		a.Logger.Error(err)
		panic(fmt.Errorf("❗failed to check version: %v", err))
	}
	ready, err := updater.IsReleaseReady(a.ReleaseDir)
	if err != nil {
		a.Logger.Error(err)
		fmt.Printf("failed to check release files: %v", err)
	}

	if latest && ready {
		fmt.Println("You use actual version!")
	} else {
		if err := updater.DownloadReleaseZip(client, release, a.ProjectDir); err != nil {
			a.Logger.Error(err)
			panic(fmt.Errorf("❗Downloading failed because of: %v", err))
		}

		if err := updater.CorrectVersionFile(a.ProjectDir, release); err != nil { //  correct version
			a.Logger.Error(err)
			panic(fmt.Errorf("❗version file ensure error: %v", err))
		}

		// unpack zip into releaseDir
		zipPath := filepath.Join(a.ProjectDir, "zapret.zip")
		if err := utils.Unzip(zipPath, a.ReleaseDir); err != nil {
			a.Logger.Error(err)
			panic(fmt.Errorf("❗unzip failed: %v", err))
		}
	}

	a.Bats = using.FindBats(a.ReleaseDir)
	runtime.EventsEmit(a.ctx, "release:ready", a.Bats)

}

// Getting sure that ProjectDir created
func ensureAppDir(path string) error {
	return os.MkdirAll(path, 0755)
}

// ======================================================= API ==================================================

// Use for run one of zapret .bat files
func (a *App) RunBat(id int) error {
	return a.Runner.Run(a.Bats, id)
}

// Kill bat process with all childrens
func (a *App) KillBat() error {
	return a.Runner.Kill()
}

// Use for finding all zapret .bat files
func (a *App) FindBats() map[int]string {
	return using.FindBats(a.ReleaseDir)
}

// Findout ZaprUI version
func (a *App) GetZaprUIVersion() (string, error) {
	return using.GetVersion(a.ProjectDir, "zaprUI_version.txt")
}

// Findout ZaprUI version
func (a *App) GetZapretVersion() (string, error) {
	return using.GetVersion(a.ProjectDir, "release_version.txt")
}

// =========== temp api ===============

// Use to create and write in empty file. If it not exist it will be created in temp. Use name with extension
// examle: WriteFile("NewTempFile.json", {"string": "string"})
func (a *App) WriteFile(name string, data map[string]interface{}) error {
	return using.WriteFile(a.Temp, name, data)
}

// Use to read your json files
func (a *App) ReadFile(name string) (map[string]interface{}, error) {
	return using.ReadFile(a.Temp, name)
}

/*
-
-
-
=================================== WAIL API ====================================
-
-
-
*/
// Close app
func (a *App) CloseWindow() {
	runtime.Quit(a.ctx)
}

// Hide window
func (a *App) WindowHide() {
	runTray(a.ctx, a.Logger)
	runtime.WindowHide(a.ctx)

}

// Show window
func (a *App) WindowShow() {
	runtime.WindowShow(a.ctx)
}

// Minimize window
func (a *App) MinimizeWindow() {
	runtime.WindowMinimise(a.ctx)
}

// Maximize window
func (a *App) MaximizeWindow() {
	runtime.WindowMaximise(a.ctx)
}

// Unmaximize window
func (a *App) UnmaximizeWindow() {
	runtime.WindowUnmaximise(a.ctx)
}

// OpenURL opens the specified URL in the default browser
func (a *App) OpenURL(url string) {
	runtime.BrowserOpenURL(a.ctx, url)
}
