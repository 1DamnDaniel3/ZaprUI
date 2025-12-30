package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/exec"
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

	if isAdmin() {
		exec.Command("sc", "stop", "WinDivert").Run()
	}
	runTray(a.ctx, a.Logger)
	windowWisible = true

	// ===========================

	defer func() {
		if r := recover(); r != nil {
			runtime.EventsEmit(a.ctx, "fatal-error", fmt.Sprintf("%v", r)) // FATAL EVENT
		}
	}()
	//============================

	// creating ProjectDir in User/AppData/Roaming/
	if err := ensureAppDir(a.ProjectDir); err != nil {
		a.Logger.Error(err)
		panic("Ошибка создания дирректории проекта")
	}
	if err := ensureAppDir(a.Temp); err != nil { // temp dir for sessions data files
		a.Logger.Error(err)
		panic("Ошибка создания дирректории временных файлов")
	}
	if err := ensureAppDir(a.ReleaseDir); err != nil { // release repo
		a.Logger.Error(err)
		panic("Ошибка создания дирректории релиза")
	}
	if err := ensureAppDir(a.ReleaseDir + "/bin"); err != nil { // release repo
		a.Logger.Error(err)
		panic("Ошибка создания дирректории релиза")
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

	ready, err := updater.IsReleaseReady(a.ReleaseDir) // Is release folder not empty
	if err != nil {
		a.Logger.Error(err)
		panic("Ошибка проверки дирректории релиза")

	}
	
	release, err := updater.ParceLatestRelease(client) // Asking GitHub Releases about latest
	if err != nil {
		if ready {
			a.Logger.Error(err)
			runtime.EventsEmit(a.ctx, "non-critical-error", `Ошибка обращения к GitHub Releases.
			Вы можете использовать устаревшую версию zapret-discord-youtube`) // NON-CRITICAL EVENT
		} else {
			a.Logger.Error(err)
			panic("Ошибка обращения к GitHub Releases. Проверьте подключение к интернету")

		}
	}
	if err := updater.EnsureVersionFileExist(a.ProjectDir, release); err != nil { //  Check VersionFile
		a.Logger.Error(err)
		panic("Ошибка проверки существования версионного файла")
	}
	a.VersionFilePath = filepath.Join(a.ProjectDir, "release_version.txt")

	latest, err := updater.IsLatestVersion(a.VersionFilePath, release) // Trying version
	if err != nil {
		a.Logger.Error(err)
		panic("Не удалось проверить версию")
	}

	// ============= If version correct and release ready we start, else Download actual
	// version of zapret and fix version

	if latest && ready {
		fmt.Println("You use actual version!")
	} else {
		if err := updater.DownloadReleaseZip(client, release, a.ProjectDir); err != nil { // Download Zip
			a.Logger.Error(err)
			panic("Ошибка загрузки последнего релиза zapret-discord-youtube")
		}

		if err := updater.CorrectVersionFile(a.ProjectDir, release); err != nil { //  fix version
			a.Logger.Error(err)
			runtime.EventsEmit(a.ctx, "non-critical-error", `Ошибка корректировки версии.
			Вы можете не получить новую версию zapret-discord-youtube`)
		}

		// unpack zip into releaseDir
		zipPath := filepath.Join(a.ProjectDir, "zapret.zip")
		if err := utils.Unzip(zipPath, a.ReleaseDir); err != nil {
			a.Logger.Error(err)
			panic("Ошибка распаковки архива zapret-dicord-youtube")
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

// Use to copy logs to clipboard
func (a *App) CopyLogsToClipboard() bool {
	a.Logger.Info("Logs copied to clipboard")
	err := utils.CopyToClipboard(a.ProjectDir, "logs.txt")
	if err != nil {
		a.Logger.Error(err)
		return false
	}
	return true
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
	windowWisible = false
	runtime.WindowHide(a.ctx)

}

// Show window
func (a *App) WindowShow() {
	windowWisible = true
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
