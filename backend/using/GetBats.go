package using

import (
	"os"
	"os/exec"
	"path/filepath"
)

// Get paths to all bat files in dir in map[int]string
func FindBats(dir string) map[int]string {
	files, err := os.ReadDir(dir)
	if err != nil {
		panic(err)
	}

	batsPath := make(map[int]string)

	for i, file := range files {
		if !file.IsDir() && filepath.Ext(file.Name()) == ".bat" {
			fullPath := filepath.Join(dir, file.Name())
			batsPath[i] = fullPath
		}
	}
	return batsPath
}

// Running any bat file
func RunBat(paths map[int]string, id int) error {
	batPath := paths[id]
	cmd := exec.Command("cmd", "/C", batPath)
	return cmd.Run()
}
