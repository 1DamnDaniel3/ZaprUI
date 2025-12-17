package updater

import (
	"os"
	"os/exec"
	"path/filepath"
)

// Fetch репозитория в %AppData%/ZaprUI/repo
func UpdateRepo(dir, branch string) error {
	cmds := [][]string{
		{"git", "fetch", "origin"},
		{"git", "reset", "--hard", "origin/" + branch},
	}

	for _, args := range cmds {
		cmd := exec.Command(args[0], args[1:]...)
		cmd.Dir = dir
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			return err
		}
	}

	return nil
}

// Проверить существует ли repo
func IsGitRepo(dir string) bool {
	_, err := os.Stat(filepath.Join(dir, ".git"))
	return err == nil
}

// Клонировать, в случае IsGitRepo == false. targetDir `%AppData%/ZaprUI/repo`
func CloneRepo(repoURL, targerDir string) error {
	cmd := exec.Command("git", "clone", "--depth=1", repoURL, targerDir)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
