package using

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// Use to create and write in empty file. If it not exist it will be created
func WriteFile(path, name string, data map[string]interface{}) error {
	pathName := filepath.Join(path, name)

	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	if err := os.WriteFile(pathName, bytes, 0644); err != nil {
		return err
	}
	return nil
}

func ReadFile(path, name string) (map[string]interface{}, error) {
	pathName := filepath.Join(path, name)

	data, err := os.ReadFile(pathName)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	err = json.Unmarshal(data, &result)
	if err != nil {
		return nil, err
	}

	return result, nil
}
