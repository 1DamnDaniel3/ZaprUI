package using

import (
	"os"
	"path/filepath"
)

// Get version of zapret or zaprUI by filenames "zaprUI_version.txt" or "release_version.txt"
func GetVersion(path, filename string) (string, error) {
	versionFilePath := filepath.Join(path, filename)
	version, err := os.ReadFile(versionFilePath)
	if err != nil {
		return "", err
	}
	return string(version), nil
}
