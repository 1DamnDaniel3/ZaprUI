package using

import (
	"os"
	"os/exec"
	"path/filepath"

	"github.com/kolesnikovae/go-winjob"
)

type BatRunner struct {
	Cmd *exec.Cmd
	Job *winjob.JobObject
}

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
func (r *BatRunner) Run(paths map[int]string, id int) error {
	batPath := paths[id]
	r.Cmd = exec.Command("cmd", "/C", batPath)

	job, err := winjob.Start(r.Cmd, winjob.LimitKillOnJobClose)
	if err != nil {
		return err
	}
	r.Job = job

	return r.Cmd.Wait()
}

// Kill bat process with all childrens
func (r *BatRunner) Kill() error {
	if r.Job != nil {
		err := r.Job.Terminate()
		r.Job.Close()
		r.Job = nil
		return err
	}
	return nil
}
