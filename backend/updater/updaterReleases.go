package updater

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ReleaseResp struct {
	TagName string `json:"tag_name"`
	Assets  []struct {
		Name string `json:"name"`
		URL  string `json:"browser_download_url"`
	} `json:"assets"`
}

func IsLocalRepo(dir string) bool {
	return false
}

func ParceLatestRelease(client *http.Client) (*ReleaseResp, error) {
	resp, err := client.Get("https://github.com/Flowseal/zapret-discord-youtube/releases/latest")
	if err != nil {
		return nil, fmt.Errorf("request to `zapret-discord-youtube/releases` fail with error: %v", err)
	}
	defer resp.Body.Close()

	var release ReleaseResp
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return nil, fmt.Errorf("cant parse resource. error: %v", err)
	}

	return &release, nil
}

func DownloadRelease(release *ReleaseResp) error {
	// var assetsURLs string

	for i, asset := range release.Assets {
		fmt.Println(i)
		fmt.Println(asset.Name)
	}

	return nil
}
