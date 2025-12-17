package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"
	"zaprUI/backend/updater"
	"zaprUI/backend/using"
	"zaprUI/backend/utils"
)

// App struct
type App struct {
	ctx             context.Context
	ProjectDir      string
	Bats            map[int]string
	VersionFilePath string
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
	gitDir := appDir + "/gitrepo"
	releaseDir := appDir + "/release"
	a.ProjectDir = appDir // push to type

	// creating ProjectDir in User/AppData/Roaming/
	if err := ensureAppDir(appDir); err != nil {
		panic(fmt.Errorf("❗error creating app directory in AppData: %w", err))
	}
	if err := ensureAppDir(gitDir); err != nil { // временное git repo
		panic(fmt.Errorf("❗error creating gitrepo directory in project dir: %w", err))
	}
	if err := ensureAppDir(releaseDir); err != nil { // release repo
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
		panic(fmt.Errorf("❗error parce latest release: %v", err))
	}
	if err := updater.EnsureVersionFileExist(a.ProjectDir, release); err != nil { //  Check VersionFile
		panic(fmt.Errorf("❗version file ensure error: %v", err))
	}
	a.VersionFilePath = filepath.Join(a.ProjectDir, "release_version.txt")

	latest, err := updater.IsLatestVersion(a.VersionFilePath, release) // Trying version
	if err != nil {
		panic(fmt.Errorf("❗failed to check version: %v", err))
	}
	ready, err := updater.IsReleaseReady(releaseDir)
	if err != nil {
		panic(fmt.Errorf("❗failed to check release files: %v", err))
	}

	if latest && ready {
		fmt.Println("You use actual version!")
	} else {
		if err := updater.DownloadReleaseZip(client, release, a.ProjectDir); err != nil {
			panic(fmt.Errorf("❗Downloading failed because of: %v", err))
		}
	}

	// unpack zip into releaseDir
	zipPath := filepath.Join(a.ProjectDir, "zapret.zip")
	if err := utils.Unzip(zipPath, releaseDir); err != nil {
		panic(fmt.Errorf("❗unzip failed: %v", err))
	}

	a.Bats = using.FindBats(releaseDir)
}

// Use for run one of zapret .bat files
func (a *App) RunBat(id int) error {
	return using.RunBat(a.Bats, id)
}

// Use for finding all zapret .bat files
func (a *App) FindBats() map[int]string {
	return using.FindBats(a.ProjectDir + "/release")
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
