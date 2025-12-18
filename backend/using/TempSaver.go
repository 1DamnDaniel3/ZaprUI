package using

import (
	"os"
	"path/filepath"
)

// Use to create and write in empty file. If it not exist it will be created
func WriteFile(path, name, text string) error {
	pathName := filepath.Join(path, name)
	err := os.WriteFile(pathName, []byte(text), 0644)
	if err != nil {
		return err
	}
	return nil
}
