package utils

import (
	"os"
	"path/filepath"

	"github.com/atotto/clipboard"
)

// Use to copy file content into clipboard
func CopyToClipboard(path, filename string) error {
	file := filepath.Join(path, filename)
	data, err := os.ReadFile(file)
	if err != nil {
		return err
	}

	if err := clipboard.WriteAll(string(data)); err != nil {
		return err
	}
	return nil
}
